const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GenerateCommitRequest {
  user_id: string;
  branch: string;
}

interface CommitData {
  title: string;
  description: string;
  full_summary: string;
  snippet_ids: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { user_id, branch }: GenerateCommitRequest = await req.json();

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get OpenAI API key from user's saved connections
    const connectionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/api_connections?user_id=eq.${user_id}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );
    
    const connections = await connectionsResponse.json();
    console.log(`Generate-commit: Found ${connections.length} connections for user ${user_id}`);
    
    const openaiConnection = connections.find(conn => conn.service_name === 'openai');
    console.log(`[generate-commit] OpenAI connection found:`, !!openaiConnection);
    
    if (!openaiConnection || !openaiConnection.api_key_encrypted?.trim()) {
      console.log(`[generate-commit] OpenAI key missing. Connection exists: ${!!openaiConnection}, Has key: ${!!openaiConnection?.api_key_encrypted}`);
      return new Response(
        JSON.stringify({
          success: false,
          message: `OpenAI API key not found in your saved connections. Please configure OpenAI in App Settings first and make sure to save the API key.`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const openaiApiKey = openaiConnection.api_key_encrypted;

    // Fetch last commit
    const lastCommitResponse = await fetch(
      `${supabaseUrl}/rest/v1/commits?user_id=eq.${user_id}&branch=eq.${branch}&order=timestamp.desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const lastCommits = await lastCommitResponse.json();
    const lastCommitTime = lastCommits.length > 0 ? lastCommits[0].timestamp : '1970-01-01T00:00:00Z';

    // Fetch uncommitted blueprint snippets since last commit
    const snippetsResponse = await fetch(
      `${supabaseUrl}/rest/v1/blueprint_snippets?user_id=eq.${user_id}&branch=eq.${branch}&committed_at=is.null&timestamp=gte.${lastCommitTime}&order=timestamp.asc`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
      }
    );

    const snippets = await snippetsResponse.json();

    if (!snippets || snippets.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No uncommitted blueprint snippets found since last commit',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate commit data using OpenAI
    const commitData = await generateCommitWithOpenAI(snippets, lastCommitTime, openaiApiKey);

    return new Response(
      JSON.stringify({
        success: true,
        commit_data: commitData,
        snippets_analyzed: snippets.length,
        last_commit_time: lastCommitTime,
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
        message: 'Failed to generate commit',
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateCommitWithOpenAI(snippets: any[], lastCommitTime: string, apiKey: string): Promise<CommitData> {
  try {
    // Prepare context for OpenAI
    const snippetsContext = snippets.map((snippet, index) => {
      return `Snippet ${index + 1}:
Title: ${snippet.title || 'Untitled'}
Themes: ${snippet.themes.join(', ')}
Timestamp: ${snippet.timestamp}
Content: ${snippet.snippet}
---`;
    }).join('\n\n');

    const prompt = `You are an expert software developer analyzing blueprint snippets to generate a professional Git commit message.

CONTEXT:
- Last commit was at: ${lastCommitTime}
- Number of snippets to analyze: ${snippets.length}
- All snippets are from the same branch and represent development work since the last commit

BLUEPRINT SNIPPETS TO ANALYZE:
${snippetsContext}

TASK:
Generate a professional Git commit with the following components:

1. COMMIT TITLE (max 72 characters):
   - Follow conventional commit format: type(scope): description
   - Use types: feat, fix, refactor, docs, style, test, chore
   - Be specific and descriptive

2. COMMIT DESCRIPTION (2-4 sentences):
   - Summarize what was implemented/changed
   - Mention key themes and improvements
   - Keep it concise but informative

3. FULL SUMMARY (detailed breakdown):
   - Organize by themes/categories
   - List specific changes and implementations
   - Include technical details and impact
   - Format as markdown with proper sections

RESPONSE FORMAT (JSON):
{
  "title": "feat(ui): implement responsive navigation and user dashboard",
  "description": "This commit introduces a responsive navigation system with collapsible sidebar and implements a comprehensive user dashboard with real-time data visualization. The changes include modern UI components, improved user experience patterns, and enhanced accessibility features.",
  "full_summary": "# Commit Summary\\n\\n## Overview\\n[detailed overview]\\n\\n## Changes by Theme\\n\\n### Navigation\\n- [specific changes]\\n\\n### Dashboard\\n- [specific changes]\\n\\n## Technical Implementation\\n- [technical details]\\n\\n## Impact\\n- [impact assessment]"
}

Analyze the snippets and generate a professional commit message that accurately represents all the development work.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software developer who creates professional Git commit messages. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    // Parse the JSON response
    let commitData: CommitData;
    try {
      const parsedResponse = JSON.parse(aiResponse);
      commitData = {
        title: parsedResponse.title,
        description: parsedResponse.description,
        full_summary: parsedResponse.full_summary,
        snippet_ids: snippets.map(s => s.id),
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      commitData = {
        title: `feat: implement ${snippets.length} blueprint snippets`,
        description: `This commit consolidates ${snippets.length} blueprint snippets with themes: ${[...new Set(snippets.flatMap(s => s.themes))].join(', ')}`,
        full_summary: `# Commit Summary\n\nAnalyzed ${snippets.length} blueprint snippets since ${lastCommitTime}.\n\n## Changes\n${snippets.map((s, i) => `${i + 1}. ${s.title || 'Blueprint Snippet'}: ${s.snippet.substring(0, 100)}...`).join('\n')}`,
        snippet_ids: snippets.map(s => s.id),
      };
    }

    return commitData;
  } catch (error) {
    // Fallback commit generation if OpenAI fails
    const themes = [...new Set(snippets.flatMap(s => s.themes))];
    return {
      title: `feat: implement ${themes.slice(0, 2).join(' and ')} features${themes.length > 2 ? ` and ${themes.length - 2} more` : ''}`,
      description: `This commit includes ${snippets.length} blueprint snippets covering: ${themes.join(', ')}. Changes implemented since last commit on ${new Date(lastCommitTime).toLocaleDateString()}.`,
      full_summary: `# Commit Summary\n\n## Overview\nThis commit consolidates ${snippets.length} blueprint snippets into a cohesive set of changes.\n\n## Changes by Theme\n${themes.map(theme => `### ${theme}\n- Multiple implementations and enhancements`).join('\n\n')}\n\n## Impact\n- Files Modified: Multiple components\n- Features Added: ${themes.join(', ')}\n- Blueprint Snippets: ${snippets.length} snippets consolidated`,
      snippet_ids: snippets.map(s => s.id),
    };
  }
}

// Centralized OpenAI key retrieval function
async function getOpenAIKey(userId: string, supabaseUrl: string, supabaseServiceKey: string): Promise<string | null> {
  try {
    console.log(`[getOpenAIKey] Fetching OpenAI key for user: ${userId}`);
    
    const response = await fetch(
      `${supabaseUrl}/rest/v1/api_connections?user_id=eq.${userId}&service_name=eq.openai&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );
    
    const connections = await response.json();
    console.log(`[getOpenAIKey] OpenAI connections found:`, connections.length);
    
    if (!connections || connections.length === 0) {
      console.log(`[getOpenAIKey] No OpenAI connection found for user ${userId}`);
      return null;
    }
    
    const openaiConnection = connections[0];
    console.log(`[getOpenAIKey] OpenAI connection details:`, {
      id: openaiConnection.id,
      service_name: openaiConnection.service_name,
      has_key: !!openaiConnection.api_key_encrypted,
      key_length: openaiConnection.api_key_encrypted?.length || 0,
      status: openaiConnection.status,
    });
    
    if (!openaiConnection.api_key_encrypted || openaiConnection.api_key_encrypted.trim() === '') {
      console.log(`[getOpenAIKey] OpenAI connection found but API key is empty`);
      return null;
    }
    
    console.log(`[getOpenAIKey] Valid OpenAI API key retrieved successfully`);
    return openaiConnection.api_key_encrypted;
  } catch (error) {
    console.error(`[getOpenAIKey] Error fetching OpenAI key:`, error);
    return null;
  }
}