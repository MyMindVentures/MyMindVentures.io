import { supabase } from './supabase';

class OpenAIService {
  private cachedKey: string | null = null;
  private lastFetch: number = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getAPIKey(userId: string = 'demo-user'): Promise<string | null> {
    // Return cached key if still valid
    if (this.cachedKey && (Date.now() - this.lastFetch) < this.cacheTimeout) {
      return this.cachedKey;
    }

    try {
      console.log('Fetching OpenAI API key from Supabase...');
      
      const { data: connections, error } = await supabase
        .from('api_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('service_name', 'openai')
        .single();

      if (error) {
        console.error('Error fetching OpenAI connection:', error);
        return null;
      }

      if (!connections || !connections.api_key_encrypted || connections.api_key_encrypted.trim() === '') {
        console.log('No valid OpenAI API key found in database');
        return null;
      }

      console.log('OpenAI API key found and cached');
      this.cachedKey = connections.api_key_encrypted;
      this.lastFetch = Date.now();
      
      return this.cachedKey;
    } catch (error) {
      console.error('Error in getAPIKey:', error);
      return null;
    }
  }

  clearCache() {
    this.cachedKey = null;
    this.lastFetch = 0;
  }

  async callOpenAI(messages: any[], options: any = {}, userId: string = 'demo-user') {
    const apiKey = await this.getAPIKey(userId);
    
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
}

export const openaiService = new OpenAIService();