import { supabase } from './supabase';

interface APIKeyCache {
  [service: string]: {
    key: string | null;
    lastFetch: number;
    metadata?: any;
  };
}

class APIService {
  private cache: APIKeyCache = {};
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getAPIKey(service: 'openai' | 'perplexity' | 'pinecone' | 'supabase', userId: string = 'demo-user'): Promise<{ key: string | null; metadata?: any }> {
    // Return cached key if still valid
    const cached = this.cache[service];
    if (cached && (Date.now() - cached.lastFetch) < this.cacheTimeout) {
      return { key: cached.key, metadata: cached.metadata };
    }

    try {
      console.log(`Fetching ${service.toUpperCase()} API key from Supabase for user: ${userId}`);
      
      const { data: connections, error } = await supabase
        .from('api_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('service_name', service)
        .single();

      if (error) {
        console.error(`Error fetching ${service} connection:`, error);
        this.cache[service] = { key: null, lastFetch: Date.now() };
        return { key: null };
      }

      if (!connections || !connections.api_key_encrypted || connections.api_key_encrypted.trim() === '') {
        console.log(`No valid ${service.toUpperCase()} API key found in database`);
        this.cache[service] = { key: null, lastFetch: Date.now() };
        return { key: null };
      }

      console.log(`${service.toUpperCase()} API key found and cached`);
      this.cache[service] = { 
        key: connections.api_key_encrypted, 
        lastFetch: Date.now(),
        metadata: connections.metadata || {}
      };
      
      return { 
        key: connections.api_key_encrypted, 
        metadata: connections.metadata || {} 
      };
    } catch (error) {
      console.error(`Error in getAPIKey for ${service}:`, error);
      this.cache[service] = { key: null, lastFetch: Date.now() };
      return { key: null };
    }
  }

  clearCache(service?: string) {
    if (service) {
      delete this.cache[service];
    } else {
      this.cache = {};
    }
  }

  // OpenAI API calls
  async callOpenAI(messages: any[], options: any = {}, userId: string = 'demo-user') {
    const { key: apiKey } = await this.getAPIKey('openai', userId);
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please save your OpenAI API key in App Settings first.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.3,
        max_tokens: 2000,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  // Perplexity API calls
  async callPerplexity(messages: any[], options: any = {}, userId: string = 'demo-user') {
    const { key: apiKey } = await this.getAPIKey('perplexity', userId);
    
    if (!apiKey) {
      throw new Error('Perplexity API key not configured. Please save your Perplexity API key in App Settings first.');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages,
        temperature: 0.3,
        max_tokens: 1000,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  // Pinecone operations
  async queryPinecone(query: any, userId: string = 'demo-user') {
    const { key: apiKey, metadata } = await this.getAPIKey('pinecone', userId);
    
    if (!apiKey) {
      throw new Error('Pinecone API key not configured. Please save your Pinecone API key in App Settings first.');
    }

    const environment = metadata?.environment;
    if (!environment) {
      throw new Error('Pinecone environment not configured. Please configure environment in App Settings.');
    }

    const indexName = metadata?.indexName || 'default';
    const response = await fetch(`https://${indexName}-${environment}.svc.pinecone.io/query`, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error(`Pinecone API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  // Test all connections
  async testAllConnections(userId: string = 'demo-user') {
    const results = {
      openai: false,
      perplexity: false,
      pinecone: false,
      supabase: false,
    };

    try {
      const { key: openaiKey } = await this.getAPIKey('openai', userId);
      if (openaiKey) {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${openaiKey}` },
        });
        results.openai = response.ok;
      }
    } catch (error) {
      console.error('OpenAI test failed:', error);
    }

    try {
      const { key: perplexityKey } = await this.getAPIKey('perplexity', userId);
      if (perplexityKey) {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1,
          }),
        });
        results.perplexity = response.status !== 401;
      }
    } catch (error) {
      console.error('Perplexity test failed:', error);
    }

    try {
      const { key: pineconeKey, metadata } = await this.getAPIKey('pinecone', userId);
      if (pineconeKey && metadata?.environment) {
        const indexName = metadata.indexName || 'default';
        const response = await fetch(`https://${indexName}-${metadata.environment}.svc.pinecone.io/describe_index_stats`, {
          method: 'POST',
          headers: {
            'Api-Key': pineconeKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        results.pinecone = response.ok;
      }
    } catch (error) {
      console.error('Pinecone test failed:', error);
    }

    try {
      const { key: supabaseKey, metadata } = await this.getAPIKey('supabase', userId);
      if (supabaseKey && metadata?.supabaseUrl) {
        const response = await fetch(`${metadata.supabaseUrl}/rest/v1/`, {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
        });
        results.supabase = response.ok;
      }
    } catch (error) {
      console.error('Supabase test failed:', error);
    }

    return results;
  }
}

export const apiService = new APIService();

// Backward compatibility
export const openaiService = {
  getAPIKey: (userId?: string) => apiService.getAPIKey('openai', userId).then(result => result.key),
  callOpenAI: (messages: any[], options?: any, userId?: string) => apiService.callOpenAI(messages, options, userId),
  clearCache: () => apiService.clearCache('openai'),
};