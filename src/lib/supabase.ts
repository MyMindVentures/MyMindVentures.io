import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase environment variables not configured. Please set up your .env file with actual Supabase credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  createPrompt: async (prompt: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('prompts')
      .insert(prompt)
      .select()
      .single();
    return { data, error };
  },

  getPrompts: async (userId: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Changelogs
  createChangelog: async (changelog: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('changelogs')
      .insert(changelog)
      .select()
      .single();
    return { data, error };
  },

  getChangelogs: async (userId: string) => {
    const { data, error } = await supabase
      .from('changelogs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Blueprint Snippets
  createBlueprintSnippet: async (snippet: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .insert(snippet)
      .select()
      .single();
    return { data, error };
  },

  getBlueprintSnippets: async (userId: string) => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Get uncommitted blueprint snippets
  getUncommittedSnippets: async (userId: string, branch: string = 'main') => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .select('*')
      .eq('user_id', userId)
      .eq('branch', branch)
      .is('committed_at', null)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Mark snippets as committed
  markSnippetsAsCommitted: async (snippetIds: string[], commitId: string) => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .update({ 
        committed_at: new Date().toISOString(),
        commit_id: commitId 
      })
      .in('id', snippetIds)
      .select();
    return { data, error };
  },

  // Commits
  createCommit: async (commit: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('commits')
      .insert(commit)
      .select()
      .single();
    return { data, error };
  },

  getCommits: async (userId: string) => {
    const { data, error } = await supabase
      .from('commits')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Publications
  createPublication: async (publication: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('publications')
      .insert(publication)
      .select()
      .single();
    return { data, error };
  },

  getPublications: async (userId: string) => {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return { data, error };
  },

  // Blueprint Files (AI-generated complete blueprints)
  createBlueprintFile: async (blueprintFile: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('blueprint_files')
      .insert(blueprintFile)
      .select()
      .single();
    return { data, error };
  },

  getBlueprintFiles: async (userId: string) => {
    const { data, error } = await supabase
      .from('blueprint_files')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Special Pages (AI-analyzed documentation)
  createOrUpdateSpecialPage: async (specialPage: Omit<any, 'id'>) => {
    const { data: existing } = await supabase
      .from('special_pages')
      .select('id')
      .eq('user_id', specialPage.user_id)
      .eq('page_type', specialPage.page_type)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('special_pages')
        .update({ ...specialPage, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from('special_pages')
        .insert(specialPage)
        .select()
        .single();
      return { data, error };
    }
  },

  getSpecialPages: async (userId: string) => {
    const { data, error } = await supabase
      .from('special_pages')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  // Feedback
  createFeedback: async (feedback: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedback)
      .select()
      .single();
    return { data, error };
  },

  getFeedback: async (userId: string) => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // API Connections
  createAPIConnection: async (connection: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('api_connections')
      .insert(connection)
      .select()
      .single();
    return { data, error };
  },

  updateAPIConnection: async (id: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('api_connections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  getAPIConnections: async (userId: string) => {
    const { data, error } = await supabase
      .from('api_connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // App Build Log
  createBuildLogEntry: async (logEntry: {
    action_type: string;
    action_description: string;
    timestamp: string;
    user_id: string;
    related_id?: string;
    metadata?: any;
  }) => {
    const { data, error } = await supabase
      .from('app_build_log')
      .insert(logEntry)
      .select()
      .single();
    return { data, error };
  },

  getBuildLog: async (userId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from('app_build_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getLastBuildLogEntry: async (userId: string, actionType?: string) => {
    let query = supabase
      .from('app_build_log')
      .select('*')
      .eq('user_id', userId);
    
    if (actionType) {
      query = query.eq('action_type', actionType);
    }
    
    const { data, error } = await query
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  // Snippet Prompts
  createSnippetPrompt: async (prompt: {
    title: string;
    content: string;
    type: 'blueprint' | 'bolt_instructions';
    user_id: string;
  }) => {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        title: prompt.title,
        content: prompt.content,
        timestamp: new Date().toISOString(),
        user_id: prompt.user_id,
      })
      .select()
      .single();
    return { data, error };
  },

  getSnippetPrompts: async (userId: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  deletePrompt: async (promptId: string) => {
    const { data, error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId)
      .select()
      .single();
    return { data, error };
  },

  // Delete operations for timeline items
  deleteBlueprintSnippet: async (snippetId: string) => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .delete()
      .eq('id', snippetId)
      .select()
      .single();
    return { data, error };
  },

  deleteCommit: async (commitId: string) => {
    const { data, error } = await supabase
      .from('commits')
      .delete()
      .eq('id', commitId)
      .select()
      .single();
    return { data, error };
  },

  deletePublication: async (publicationId: string) => {
    const { data, error } = await supabase
      .from('publications')
      .delete()
      .eq('id', publicationId)
      .select()
      .single();
    return { data, error };
  },

  deleteBlueprintFile: async (fileId: string) => {
    const { data, error } = await supabase
      .from('blueprint_files')
      .delete()
      .eq('id', fileId)
      .select()
      .single();
    return { data, error };
  },

  deleteSpecialPage: async (pageId: string) => {
    const { data, error } = await supabase
      .from('special_pages')
      .delete()
      .eq('id', pageId)
      .select()
      .single();
    return { data, error };
  },

  // Update operations for timeline items
  updateBlueprintSnippet: async (snippetId: string, updates: any) => {
    const { data, error } = await supabase
      .from('blueprint_snippets')
      .update(updates)
      .eq('id', snippetId)
      .select()
      .single();
    return { data, error };
  },

  updateCommit: async (commitId: string, updates: any) => {
    const { data, error } = await supabase
      .from('commits')
      .update(updates)
      .eq('id', commitId)
      .select()
      .single();
    return { data, error };
  },

  updatePublication: async (publicationId: string, updates: any) => {
    const { data, error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', publicationId)
      .select()
      .single();
    return { data, error };
  },

  updateBlueprintFile: async (fileId: string, updates: any) => {
    const { data, error } = await supabase
      .from('blueprint_files')
      .update(updates)
      .eq('id', fileId)
      .select()
      .single();
    return { data, error };
  },

  updateSpecialPage: async (pageId: string, updates: any) => {
    const { data, error } = await supabase
      .from('special_pages')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single();
    return { data, error };
  },

  // Recovery Documentation
  getRecoveryDocumentation: async (userId: string) => {
    const { data, error } = await supabase
      .from('recovery_documentation')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  getDocumentationPages: async (userId: string) => {
    const { data, error } = await supabase
      .from('documentation_pages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  // Users
  getUserProfile: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  updateUserProfile: async (email: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email)
      .select()
      .single();
    return { data, error };
  },

  // Pitch Content
  getPitchContent: async (userId: string) => {
    const { data, error } = await supabase
      .from('pitch_content')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });
    return { data, error };
  },

  createPitchContent: async (content: {
    section_type: string;
    title: string;
    content: string;
    metadata?: any;
    version?: string;
    user_id: string;
  }) => {
    const { data, error } = await supabase
      .from('pitch_content')
      .insert({
        ...content,
        generated_by_ai: true,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  // Pitch Analytics
  trackPitchAnalytics: async (analytics: {
    visitor_id: string;
    page_views?: number;
    time_spent?: number;
    features_viewed?: string[];
    cta_clicks?: number;
    user_id: string;
  }) => {
    const { data, error } = await supabase
      .from('pitch_analytics')
      .insert({
        ...analytics,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  }
};