const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GeneratePitchRequest {
  user_id: string;
  section_type: 'hero' | 'features' | 'testimonials' | 'stats' | 'cta' | 'complete';
  force_regenerate?: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { user_id, section_type, force_regenerate }: GeneratePitchRequest = await req.json();
    
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
    console.log(`Pitch content: Found ${connections.length} connections for user ${user_id}`);
    console.log('All connections:', connections.map(c => ({ 
      service: c.service_name, 
      has_key: !!c.api_key_encrypted,
      key_length: c.api_key_encrypted?.length || 0 
    })));
    
    const openaiConnection = connections.find(conn => conn.service_name === 'openai');
    console.log('OpenAI connection found:', !!openaiConnection);
    
    let openaiApiKey = openaiConnection?.api_key_encrypted?.trim();
    
    // TEMPORARY FALLBACK: Use environment variable if no key in database
    if (!openaiApiKey) {
      openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (openaiApiKey) {
        console.log('Using fallback OpenAI API key from environment');
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            message: `OpenAI API key not found or empty. Found ${connections.length} total connections for user ${user_id}. OpenAI connection exists: ${!!openaiConnection}. Please save your OpenAI API key in App Settings first.`,
            debug: {
              user_id,
              connections_found: connections.length,
              openai_connection_exists: !!openaiConnection,
              openai_connection_details: openaiConnection ? {
                service_name: openaiConnection.service_name,
                has_key: !!openaiConnection.api_key_encrypted,
                key_length: openaiConnection.api_key_encrypted?.length || 0,
                status: openaiConnection.status,
              } : null,
              all_connections: connections.map(c => ({ service: c.service_name, has_key: !!c.api_key_encrypted })),
            }
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get latest recovery documentation for context
    const recoveryResponse = await fetch(
      `${supabaseUrl}/rest/v1/recovery_documentation?user_id=eq.${user_id}&order=timestamp.desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );
    
    const recoveryDocs = await recoveryResponse.json();
    const latestRecovery = recoveryDocs[0];

    // Get existing pitch content for context
    const pitchResponse = await fetch(
      `${supabaseUrl}/rest/v1/pitch_content?user_id=eq.${user_id}&order=last_updated.desc`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );
    
    const existingPitch = await pitchResponse.json();

    // Generate new pitch content with OpenAI
    const pitchContent = await generatePitchWithOpenAI(
      section_type, 
      latestRecovery, 
      existingPitch, 
      openaiApiKey
    );

    // Store in Supabase
    const storeResponse = await fetch(
      `${supabaseUrl}/rest/v1/pitch_content`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section_type: pitchContent.section_type,
          title: pitchContent.title,
          content: pitchContent.content,
          metadata: pitchContent.metadata,
          version: pitchContent.version,
          generated_by_ai: true,
          user_id: user_id,
        }),
      }
    );

    const storedContent = await storeResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        pitch_content: pitchContent,
        stored_id: storedContent.id,
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
        message: 'Pitch generation failed',
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generatePitchWithOpenAI(
  sectionType: string, 
  latestRecovery: any, 
  existingPitch: any[], 
  apiKey: string
) {
  const prompt = `You are creating an AMAZING PITCH DEMO for MyMindVentures.io - a REVOLUTIONARY platform created by a brilliant developer with ADHD who has extraordinary blueprinting talents.

🧠 THE INNOVATIVE MIND BEHIND THIS:
This platform was created by someone with ADHD who has a unique talent for blueprinting applications. Their mind works differently - they see patterns and solutions others miss. With the help of Perplexity.ai and Bolt.ai, they've created something truly revolutionary.

🚀 BREAKTHROUGH INNOVATIONS TO SHOWCASE:

1. **AI-Powered Recovery Documentation System** (WORLD'S FIRST)
   - OpenAI scans entire codebase in real-time
   - Creates visual recovery maps for when builds break
   - Always up-to-date, never lies, never outdated
   - Complete application reconstruction guide

2. **Revolutionary Blueprint Snippet Workflow** (ADHD-FRIENDLY)
   - Captures scattered thoughts into structured snippets
   - AI transforms thoughts into professional commits
   - Perfect for ADHD thinking patterns
   - Automated workflow from idea to documentation

3. **Multi-AI Orchestration** (FIRST OF ITS KIND)
   - OpenAI + Perplexity + Pinecone working together
   - Each AI specialized for different tasks
   - Seamless integration and coordination
   - Revolutionary AI collaboration

4. **Always-True Documentation** (NEVER OUTDATED)
   - Documentation updates automatically with code changes
   - Real-time synchronization with development
   - Zero maintenance required
   - 100% accuracy guaranteed

5. **Visual Recovery System** (BREAKTHROUGH TECHNOLOGY)
   - Complete visual maps of navigation, components, user flows
   - Step-by-step rebuild instructions
   - Works when everything else fails
   - Ultimate fallback system

6. **Git Interface in Browser** (IDE-LEVEL FUNCTIONALITY)
   - Full Git commands in WebContainer
   - AI-generated commit messages
   - Professional development workflow
   - Browser-based IDE capabilities

7. **Real-time Monitoring & Analytics** (COMPREHENSIVE)
   - API health monitoring
   - Database performance tracking
   - User flow analytics
   - Complete system oversight

8. **4-Level Navigation Hierarchy** (SOPHISTICATED ARCHITECTURE)
   - Intuitive navigation structure
   - Collapsible sidebar design
   - Visual hierarchy with animations
   - Mobile-optimized experience

LATEST ANALYSIS DATA:
${latestRecovery ? `
- Files Analyzed: ${latestRecovery.files_analyzed || 'Multiple'}
- Last Analysis: ${latestRecovery.timestamp}
- Analysis Summary: ${latestRecovery.analysis_summary}
` : 'No recent analysis available'}

EXISTING PITCH CONTENT:
${existingPitch.map(p => `${p.section_type}: ${p.title}`).join('\n')}

SECTION TO GENERATE: ${sectionType}

REQUIREMENTS:
- Make it AMAZING and showcase the revolutionary nature
- Highlight the ADHD-friendly innovations
- Emphasize the breakthrough technologies
- Show how this is different from anything else
- Use compelling, exciting language
- Include specific technical achievements
- Make it shareable and impressive

RESPONSE FORMAT (JSON):
{
  "section_type": "${sectionType}",
  "title": "Compelling section title",
  "content": "Amazing content that showcases the revolutionary features and innovations",
  "metadata": {
    "stats": ["impressive statistics"],
    "highlights": ["key breakthrough features"],
    "colors": ["gradient color suggestions"],
    "animations": ["animation suggestions"],
    "call_to_action": "compelling CTA text"
  },
  "version": "v1.0.0"
}

Create content that makes people say "WOW, I've never seen anything like this!" Focus on the revolutionary aspects and the brilliant mind behind it.`;

  try {
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
            content: 'You are a world-class marketing expert who creates amazing pitch demos for revolutionary technology platforms. Always respond with valid JSON only. Make it compelling and showcase breakthrough innovations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      // Fallback content
      return {
        section_type: sectionType,
        title: "Revolutionary Developer Platform",
        content: "MyMindVentures.io showcases breakthrough innovations in AI-powered development workflows, created by a brilliant mind with ADHD who has extraordinary blueprinting talents.",
        metadata: {
          stats: ["96% Automation", "3 AI Services", "Real-time Updates"],
          highlights: ["AI Recovery System", "Blueprint Workflows", "Multi-AI Integration"],
          colors: ["from-cyan-400 to-purple-500"],
          animations: ["fadeInUp", "scaleIn"],
          call_to_action: "Experience the Revolution"
        },
        version: "v1.0.0"
      };
    }
  } catch (error) {
    throw new Error(`OpenAI pitch generation failed: ${error.message}`);
  }
}

// Centralized OpenAI key retrieval function
async function getOpenAIKey(userId: string, supabaseUrl: string, supabaseServiceKey: string): Promise<string | null> {
  try {
    console.log(`Fetching OpenAI key for user: ${userId}`);
    
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
    console.log('OpenAI connections found:', connections.length);
    
    if (!connections || connections.length === 0) {
      console.log('No OpenAI connection found');
      return null;
    }
    
    const openaiConnection = connections[0];
    console.log('OpenAI connection details:', {
      id: openaiConnection.id,
      service_name: openaiConnection.service_name,
      has_key: !!openaiConnection.api_key_encrypted,
      key_length: openaiConnection.api_key_encrypted?.length || 0,
      status: openaiConnection.status,
    });
    
    if (!openaiConnection.api_key_encrypted || openaiConnection.api_key_encrypted.trim() === '') {
      console.log('OpenAI connection found but API key is empty');
      return null;
    }
    
    console.log('Valid OpenAI API key retrieved successfully');
    return openaiConnection.api_key_encrypted;
  } catch (error) {
    console.error('Error fetching OpenAI key:', error);
    return null;
  }
}