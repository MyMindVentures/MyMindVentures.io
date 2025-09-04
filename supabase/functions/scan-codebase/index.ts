const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ScanCodebaseRequest {
  user_id: string;
  scan_type: 'complete' | 'navigation' | 'components' | 'database';
  generate_commit?: boolean;
  commit_message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { user_id, scan_type, generate_commit, commit_message }: ScanCodebaseRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get OpenAI API key using centralized service
    let openaiApiKey = await getOpenAIKey(user_id, supabaseUrl, supabaseServiceKey);
    
    // TEMPORARY FALLBACK: Use environment variable if no key in database
    if (!openaiApiKey) {
      openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (openaiApiKey) {
        console.log('Using fallback OpenAI API key from environment');
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'OpenAI API key not found in your saved connections. Please configure OpenAI in App Settings first and make sure to save the API key.',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    console.log('Starting OpenAI codebase analysis...');
    
    // Scan the actual file system
    const codebaseData = await scanFileSystem();
    
    console.log(`Scanned ${codebaseData.files.length} files, sending to OpenAI for analysis...`);
    
    // Let OpenAI analyze the complete codebase
    const documentation = await analyzeCodebaseWithOpenAI(codebaseData, scan_type, openaiApiKey);
    
    console.log('OpenAI analysis completed, storing in Supabase...');
    
    // Store recovery documentation in Supabase
    const recoveryDocResponse = await fetch(
      `${supabaseUrl}/rest/v1/recovery_documentation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: documentation.timestamp,
          analysis_summary: documentation.analysis_summary,
          full_documentation: documentation.full_documentation,
          navigation_map: documentation.navigation_map,
          component_map: documentation.component_map,
          file_inventory: documentation.file_inventory,
          user_flows: documentation.user_flows,
          database_analysis: documentation.database_analysis,
          api_analysis: documentation.api_analysis,
          recovery_guide: documentation.recovery_guide,
          files_analyzed: documentation.files_analyzed,
          user_id: user_id,
        }),
      }
    );

    const recoveryDoc = await recoveryDocResponse.json();
    const recoveryDocId = recoveryDoc.id;

    console.log('Recovery documentation stored, updating all documentation pages...');

    // Update all documentation pages
    const documentationPages = [
      {
        page_type: 'app_architecture',
        title: 'App Architecture - AI Updated',
        content: documentation.navigation_map ? JSON.stringify(documentation.navigation_map, null, 2) : 'Architecture analysis completed',
      },
      {
        page_type: 'userflow_pipelines',
        title: 'UserFlow/Pipelines - AI Updated',
        content: documentation.user_flows ? JSON.stringify(documentation.user_flows, null, 2) : 'User flows analysis completed',
      },
      {
        page_type: 'database_management',
        title: 'Database Management - AI Updated',
        content: documentation.database_analysis ? JSON.stringify(documentation.database_analysis, null, 2) : 'Database analysis completed',
      },
      {
        page_type: 'toolstack_overview',
        title: 'Toolstack Overview - AI Updated',
        content: documentation.api_analysis ? JSON.stringify(documentation.api_analysis, null, 2) : 'Toolstack analysis completed',
      },
      {
        page_type: 'user_guide',
        title: 'User Guide - AI Updated',
        content: documentation.recovery_guide || 'User guide updated by AI analysis',
      },
    ];

    // Store each documentation page
    for (const page of documentationPages) {
      await fetch(
        `${supabaseUrl}/rest/v1/documentation_pages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...page,
            recovery_doc_id: recoveryDocId,
            timestamp: documentation.timestamp,
            user_id: user_id,
          }),
        }
      );
    }

    console.log('All documentation pages updated');

    // Generate backup file
    const backupData = {
      generated_at: documentation.timestamp,
      application: 'MyMindVentures.io',
      recovery_doc_id: recoveryDocId,
      complete_analysis: documentation,
      file_inventory: codebaseData.files.map(f => ({
        path: f.path,
        type: f.type,
        size: f.size,
        lastModified: f.lastModified,
      })),
      directories: codebaseData.directories,
      total_files: codebaseData.files.length,
      total_size: codebaseData.total_size,
    };

    // Create backup file URL (in production, this would be uploaded to storage)
    const backupFileName = `mymindventures-recovery-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    
    // Generate commit if requested
    let commitData = null;
    if (generate_commit) {
      commitData = await generateCommitWithOpenAI(codebaseData, documentation, commit_message || '', openaiApiKey);
    }

    console.log('Complete AI analysis workflow finished successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        documentation,
        recovery_doc_id: recoveryDocId,
        backup_data: backupData,
        backup_filename: backupFileName,
        commit_data: commitData,
        files_scanned: codebaseData.files.length,
        pages_updated: documentationPages.length,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Codebase scan error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Codebase scan failed',
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scanFileSystem() {
  const codebaseData = {
    project_name: 'MyMindVentures.io',
    scan_timestamp: new Date().toISOString(),
    files: [] as any[],
    directories: [] as string[],
    total_size: 0,
  };

  try {
    console.log('Starting file system scan...');
    
    // Scan the project directory recursively
    const projectPath = '/home/project';
    await scanDirectory(projectPath, codebaseData, '');
    
    console.log(`File system scan completed: ${codebaseData.files.length} files in ${codebaseData.directories.length} directories`);
    
    return codebaseData;
  } catch (error) {
    console.error('File system scan error:', error);
    throw new Error(`File system scan failed: ${error.message}`);
  }
}

async function scanDirectory(basePath: string, codebaseData: any, relativePath: string) {
  try {
    const fullPath = basePath + relativePath;
    
    const entries = [];
    try {
      for await (const entry of Deno.readDir(fullPath)) {
        entries.push(entry);
      }
    } catch (error) {
      console.log(`Cannot read directory: ${fullPath} - ${error.message}`);
      return;
    }

    for (const entry of entries) {
      const entryFullPath = `${fullPath}/${entry.name}`;
      const entryRelativePath = `${relativePath}/${entry.name}`;
      
      // Skip certain directories and files
      if (shouldSkipPath(entry.name, entryRelativePath)) {
        continue;
      }

      if (entry.isDirectory) {
        codebaseData.directories.push(entryRelativePath);
        // Recursively scan subdirectories
        await scanDirectory(basePath, codebaseData, entryRelativePath);
      } else if (entry.isFile) {
        try {
          // Read file content
          const content = await Deno.readTextFile(entryFullPath);
          const stats = await Deno.stat(entryFullPath);
          
          codebaseData.files.push({
            path: entryRelativePath,
            name: entry.name,
            extension: getFileExtension(entry.name),
            size: stats.size,
            content: content,
            lastModified: stats.mtime?.toISOString() || new Date().toISOString(),
            type: getFileType(entry.name),
          });
          
          codebaseData.total_size += stats.size || 0;
        } catch (error) {
          console.log(`Cannot read file: ${entryFullPath} - ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${basePath + relativePath}:`, error);
  }
}

function shouldSkipPath(name: string, path: string): boolean {
  const skipPatterns = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.vite',
    'coverage',
    '.nyc_output',
    'package-lock.json',
    '.env',
    '.env.local',
    '.DS_Store',
    'Thumbs.db',
    '.bolt'
  ];
  
  return skipPatterns.some(pattern => 
    name.includes(pattern) || path.includes(pattern)
  );
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.substring(lastDot) : '';
}

function getFileType(filename: string): string {
  const extension = getFileExtension(filename).toLowerCase();
  
  const typeMap: { [key: string]: string } = {
    '.tsx': 'react-component',
    '.ts': 'typescript',
    '.js': 'javascript',
    '.jsx': 'react-component',
    '.css': 'stylesheet',
    '.md': 'markdown',
    '.json': 'config',
    '.html': 'markup',
    '.sql': 'database',
    '.yml': 'config',
    '.yaml': 'config',
  };
  
  return typeMap[extension] || 'text';
}

async function analyzeCodebaseWithOpenAI(codebaseData: any, scanType: string, apiKey: string) {
  const prompt = `You are analyzing the codebase of MyMindVentures.io - a revolutionary platform created by an innovative mind with ADHD who has a unique talent for blueprinting applications. This developer has created something truly special with the help of Perplexity.ai and Bolt.ai.

MISSION: Document this UNIQUE and INNOVATIVE application that showcases breakthrough features nobody else would think of. This is not just documentation - it's showcasing a brilliant mind's work.

UNIQUE FEATURES TO HIGHLIGHT:
🧠 INNOVATIVE MIND FEATURES:
- AI-Powered Recovery Documentation System (WORLD'S FIRST real-time codebase analysis)
- Dynamic Blueprint Snippet Workflow (revolutionary development process)
- Automated Documentation Updates (always true, never outdated)
- Multi-AI Integration (OpenAI + Perplexity + Pinecone working together)
- Real-time Codebase Scanning (breakthrough technology)
- Visual Recovery System (unique fallback when builds break)
- Automated Workflow Pipelines (intelligent development automation)
- 4-Level Navigation Hierarchy (sophisticated app architecture)
- Edge Function AI Integration (serverless AI processing)
- Complete Git Interface in WebContainer (IDE-level functionality in browser)

🚀 REVOLUTIONARY WORKFLOWS:
- Blueprint Snippet → AI Analysis → Commit Generation → Documentation Update → Publication (COMPLETE AUTOMATION)
- File System Monitoring → AI Content Generation → Automatic Snippet Creation (INTELLIGENT MONITORING)
- Codebase Scanning → Recovery Documentation → Backup Generation → Git Integration (ULTIMATE RECOVERY)
- Real-time API Monitoring → Performance Tracking → Health Checks (COMPREHENSIVE MONITORING)

💡 BREAKTHROUGH INNOVATIONS:
- First platform to combine AI codebase analysis with real-time recovery documentation
- Revolutionary blueprint snippet system that captures development thoughts and converts to structured commits
- Automated documentation that's ALWAYS up-to-date (never lies, never outdated)
- Multi-AI orchestration for different specialized tasks
- Visual recovery system that can rebuild entire applications from documentation
- Git interface integrated directly in web application for WebContainer development
- Real-time file monitoring with AI-powered content generation

🎯 ADHD-FRIENDLY DESIGN:
- Captures scattered thoughts into structured blueprint snippets
- Automated workflows reduce cognitive load
- Visual recovery system for when focus is lost
- Always up-to-date documentation prevents confusion
- AI assistance for complex tasks
- Structured development process that works with ADHD thinking patterns
CODEBASE SCAN RESULTS:
- Project: ${codebaseData.project_name}
- Files Scanned: ${codebaseData.files.length}
- Directories: ${codebaseData.directories.length}
- Total Size: ${Math.round(codebaseData.total_size / 1024)} KB
- Scan Time: ${codebaseData.scan_timestamp}

COMPLETE FILE CONTENTS:
${codebaseData.files.map(file => `
=== FILE: ${file.path} ===
Type: ${file.type} | Extension: ${file.extension} | Size: ${file.size} bytes
Last Modified: ${file.lastModified}

FULL CONTENT:
${file.content}

=== END FILE ===
`).join('\n')}

DIRECTORIES STRUCTURE:
${codebaseData.directories.join('\n')}

CRITICAL ANALYSIS REQUIREMENTS:

SHOWCASE THE INNOVATION: This is not a typical app - this is a REVOLUTIONARY PLATFORM created by a brilliant mind with ADHD who has invented breakthrough features. Highlight every unique aspect!

1. NAVIGATION MAPPING: Document EVERY navigation item, menu, button, link, and route you find in the actual code
2. COMPONENT INVENTORY: List EVERY component with their props, functionality, and relationships
3. USER FLOW DOCUMENTATION: Map out EVERY user journey and interaction flow
4. DATABASE SCHEMA: Document the complete database structure and relationships
5. API INTEGRATIONS: Document all external services and API endpoints
6. VISUAL RECOVERY GUIDE: Create step-by-step visual reconstruction instructions
7. BUSINESS LOGIC: Document all workflows, processes, and business rules
8. SECURITY IMPLEMENTATION: Document authentication, authorization, and security measures
9. UNIQUE INNOVATIONS: Highlight every breakthrough feature and innovative workflow
10. ADHD-FRIENDLY FEATURES: Document how the app supports ADHD thinking patterns
11. AI ORCHESTRATION: Document the multi-AI integration and automation
12. REVOLUTIONARY WORKFLOWS: Document the unique development processes

RESPONSE FORMAT (JSON):
{
  "timestamp": "${new Date().toISOString()}",
  "analysis_summary": "SHOWCASE THE REVOLUTIONARY FEATURES: This is MyMindVentures.io - a breakthrough platform created by an innovative ADHD mind. Highlight the unique AI-powered recovery system, automated workflows, multi-AI integration, and revolutionary development processes that nobody else has thought of. Be extremely detailed about the innovative features found.",
  "full_documentation": "# MyMindVentures.io - Revolutionary Developer Platform\n\n## 🧠 INNOVATIVE MIND SHOWCASE\nCreated by a brilliant developer with ADHD who has revolutionized development workflows...\n\n## 🚀 BREAKTHROUGH FEATURES\n[Document all unique features]\n\n## 💡 REVOLUTIONARY WORKFLOWS\n[Document the innovative processes]\n\n## 🎯 ADHD-FRIENDLY DESIGN\n[Document how it supports ADHD thinking]\n\n## 🔧 VISUAL RECOVERY SYSTEM\n[Complete recovery instructions]",
  "navigation_map": {
    "main_navigation": ["exact navigation items found in code"],
    "sub_navigation": ["exact sub-navigation items found"],
    "routes": ["all routes and paths found"],
    "user_flows": ["complete user journey mappings"],
    "interactive_elements": ["all buttons, links, and interactive elements"]
  },
  "component_map": {
    "ui_components": [
      {
        "name": "component name",
        "path": "file path",
        "props": ["list of props"],
        "functionality": "what it does",
        "dependencies": ["what it imports/uses"]
      }
    ],
    "page_components": ["same structure for pages"],
    "layout_components": ["same structure for layouts"],
    "business_components": ["same structure for business logic"]
  },
  "file_inventory": [
    {
      "path": "exact file path",
      "type": "file type",
      "purpose": "detailed purpose based on content analysis",
      "key_exports": ["main exports/functions"],
      "dependencies": ["files it imports"],
      "size": "file size",
      "complexity": "low/medium/high"
    }
  ],
  "user_flows": [
    {
      "name": "flow name",
      "description": "detailed flow description",
      "steps": ["step by step user actions"],
      "components_involved": ["components used in this flow"],
      "entry_points": ["how users start this flow"],
      "exit_points": ["how users complete this flow"]
    }
  ],
  "database_analysis": {
    "tables": ["all database tables found"],
    "relationships": ["table relationships"],
    "security": ["RLS policies and security measures"],
    "operations": ["CRUD operations found in code"]
  },
  "api_analysis": {
    "external_services": ["OpenAI, Supabase, etc."],
    "endpoints": ["API endpoints found"],
    "authentication": ["auth methods used"],
    "error_handling": ["error handling patterns"]
  },
  "recovery_guide": "Step-by-step markdown guide for complete application reconstruction including exact file structure, component hierarchy, navigation setup, database schema, and deployment procedures",
  "files_analyzed": ${codebaseData.files.length},
  "status": "completed"
}

IMPORTANT: 
- Analyze the ACTUAL code content provided above
- Document EXACTLY what exists in the codebase
- Create a VISUAL recovery system that shows every navigation item, button, component, and user flow
- Make this the ultimate fallback documentation for when builds break
- Be extremely detailed and comprehensive - this is a recovery system!`;

  try {
    console.log('Sending codebase to OpenAI for analysis...');
    
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
            content: 'You are an expert software architect who creates comprehensive recovery documentation by analyzing complete codebases. Always respond with valid JSON only. Analyze the ACTUAL code provided, not assumptions. Create the ultimate visual recovery guide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    console.log('OpenAI analysis completed, parsing response...');

    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      console.log('OpenAI response parsed successfully');
      
      return {
        timestamp: parsedResponse.timestamp,
        analysis_summary: parsedResponse.analysis_summary,
        full_documentation: parsedResponse.full_documentation,
        navigation_map: parsedResponse.navigation_map || {},
        component_map: parsedResponse.component_map || {},
        file_inventory: parsedResponse.file_inventory || [],
        user_flows: parsedResponse.user_flows || [],
        database_analysis: parsedResponse.database_analysis || {},
        api_analysis: parsedResponse.api_analysis || {},
        recovery_guide: parsedResponse.recovery_guide,
        files_analyzed: codebaseData.files.length,
        status: 'completed',
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
}

async function generateCommitWithOpenAI(codebaseData: any, documentation: any, customMessage: string, apiKey: string) {
  if (!customMessage.trim()) {
    return null;
  }

  try {
    const prompt = `Based on the complete codebase analysis, generate a professional Git commit message.

CODEBASE SUMMARY:
- Files: ${codebaseData.files.length}
- Analysis: ${documentation.analysis_summary}

USER REQUEST: "${customMessage}"

Generate a conventional commit message (type(scope): description) and detailed summary.

RESPONSE FORMAT (JSON):
{
  "title": "conventional commit title",
  "description": "detailed commit description",
  "full_summary": "comprehensive technical summary"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error('Commit generation failed:', error);
    return {
      title: customMessage,
      description: 'AI-powered codebase analysis and documentation update',
      full_summary: `Complete codebase analysis performed with ${codebaseData.files.length} files analyzed and all documentation pages updated.`,
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
    
    if (!response.ok) {
      console.error(`[getOpenAIKey] HTTP error: ${response.status} ${response.statusText}`);
      return null;
    }
    
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