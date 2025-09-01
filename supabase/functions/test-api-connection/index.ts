const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface TestConnectionRequest {
  service: string;
  apiKey: string;
  additionalParams?: Record<string, any>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { service, apiKey, additionalParams }: TestConnectionRequest = await req.json();

    let testResult = false;
    let message = '';
    let responseTime = 0;
    const startTime = Date.now();

    switch (service) {
      case 'openai':
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          responseTime = Date.now() - startTime;
          testResult = response.ok;
          message = response.ok ? 'OpenAI connection successful' : `OpenAI connection failed: ${response.status}`;
        } catch (error) {
          responseTime = Date.now() - startTime;
          message = `Failed to connect to OpenAI: ${error.message}`;
        }
        break;

      case 'perplexity':
        try {
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 1,
            }),
          });
          responseTime = Date.now() - startTime;
          testResult = response.status !== 401;
          message = testResult ? 'Perplexity connection successful' : 'Invalid Perplexity API key';
        } catch (error) {
          responseTime = Date.now() - startTime;
          message = 'Failed to connect to Perplexity';
        }
        break;

      case 'pinecone':
        try {
          const { environment, indexName } = additionalParams || {};
          if (!environment) {
            message = 'Pinecone environment is required';
            break;
          }
          
          const response = await fetch(`https://${indexName || 'default'}-${environment}.svc.pinecone.io/describe_index_stats`, {
            method: 'POST',
            headers: {
              'Api-Key': apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
          responseTime = Date.now() - startTime;
          testResult = response.ok;
          message = response.ok ? 'Pinecone connection successful' : 'Invalid Pinecone credentials or configuration';
        } catch (error) {
          responseTime = Date.now() - startTime;
          message = 'Failed to connect to Pinecone';
        }
        break;

      case 'supabase':
        try {
          const { supabaseUrl } = additionalParams || {};
          if (!supabaseUrl) {
            message = 'Supabase URL is required';
            break;
          }
          
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'apikey': apiKey,
              'Content-Type': 'application/json',
            },
          });
          responseTime = Date.now() - startTime;
          testResult = response.ok;
          message = response.ok ? 'Supabase connection successful' : 'Invalid Supabase credentials';
        } catch (error) {
          responseTime = Date.now() - startTime;
          message = 'Failed to connect to Supabase';
        }
        break;

      default:
        message = 'Unknown service';
    }

    return new Response(
      JSON.stringify({
        success: testResult,
        message,
        service,
        responseTime,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});