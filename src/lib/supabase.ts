import { createClient } from '@supabase/supabase-js';
import pineconeService from './pinecone';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === 'your_supabase_project_url' ||
  supabaseAnonKey === 'your_supabase_anon_key'
) {
  console.warn(
    'Supabase environment variables not configured. Please set up your .env file with actual Supabase credentials.'
  );
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

  // Git Management Functions
  // Commits
  createCommit: async (commit: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('commits')
      .insert(commit)
      .select()
      .single();
    return { data, error };
  },

  getCommits: async (userId: string, branch?: string) => {
    let query = supabase
      .from('commits')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (branch) {
      query = query.eq('branch', branch);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Branches
  createBranch: async (branch: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    return { data, error };
  },

  getBranches: async (userId: string) => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    return { data, error };
  },

  switchBranch: async (userId: string, branchName: string) => {
    // First, set all branches to not current
    await supabase
      .from('branches')
      .update({ is_current: false })
      .eq('user_id', userId);

    // Then set the target branch as current
    const { data, error } = await supabase
      .from('branches')
      .update({ is_current: true })
      .eq('user_id', userId)
      .eq('name', branchName)
      .select()
      .single();
    return { data, error };
  },

  // File Status
  getFileStatus: async (userId: string, branch: string) => {
    const { data, error } = await supabase
      .from('file_status')
      .select('*')
      .eq('user_id', userId)
      .eq('branch', branch)
      .order('path');
    return { data, error };
  },

  updateFileStatus: async (userId: string, filePath: string, updates: any) => {
    const { data, error } = await supabase
      .from('file_status')
      .update(updates)
      .eq('user_id', userId)
      .eq('path', filePath)
      .select()
      .single();
    return { data, error };
  },

  addFileStatus: async (fileStatus: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('file_status')
      .insert(fileStatus)
      .select()
      .single();
    return { data, error };
  },

  // Git Settings
  getGitSettings: async (userId: string) => {
    const { data, error } = await supabase
      .from('git_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateGitSettings: async (userId: string, settings: any) => {
    const { data, error } = await supabase
      .from('git_settings')
      .upsert({ user_id: userId, ...settings })
      .select()
      .single();
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
  },

  // Debug Logs Functions
  createDebugLog: async (debugLog: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('debug_logs')
      .insert(debugLog)
      .select()
      .single();
    return { data, error };
  },

  getDebugLogs: async (
    userId: string,
    filters?: {
      severity?: string;
      category?: string;
      status?: string;
      limit?: number;
    }
  ) => {
    let query = supabase
      .from('debug_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data, error };
  },

  updateDebugLog: async (logId: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('debug_logs')
      .update(updates)
      .eq('log_id', logId)
      .select()
      .single();
    return { data, error };
  },

  findSimilarDebugLogs: async (
    title: string,
    description: string,
    userId: string
  ) => {
    // Search by keywords in title and description
    const { data, error } = await supabase
      .from('debug_logs')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${title}%,description.ilike.%${description}%`)
      .order('timestamp', { ascending: false })
      .limit(10);

    return { data, error };
  },

  getDebugLogStats: async (userId: string) => {
    const { data, error } = await supabase
      .from('debug_logs')
      .select('severity, category, status')
      .eq('user_id', userId);

    if (error) return { data: null, error };

    const stats = {
      total: data.length,
      bySeverity: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      unresolved: 0,
    };

    data.forEach(log => {
      stats.bySeverity[log.severity] =
        (stats.bySeverity[log.severity] || 0) + 1;
      stats.byCategory[log.category] =
        (stats.byCategory[log.category] || 0) + 1;
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;

      if (log.status !== 'resolved' && log.status !== 'closed') {
        stats.unresolved++;
      }
    });

    return { data: stats, error: null };
  },

  // Toolkit Modules Functions
  createToolkitModule: async (module: Omit<any, 'id'>) => {
    const { data, error } = await supabase
      .from('toolkit_modules')
      .insert(module)
      .select()
      .single();
    return { data, error };
  },

  getToolkitModules: async (userId: string) => {
    const { data, error } = await supabase
      .from('toolkit_modules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  updateToolkitModule: async (moduleId: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('toolkit_modules')
      .update(updates)
      .eq('module_id', moduleId)
      .select()
      .single();
    return { data, error };
  },

  deleteToolkitModule: async (moduleId: string) => {
    const { data, error } = await supabase
      .from('toolkit_modules')
      .delete()
      .eq('module_id', moduleId);
    return { data, error };
  },

  // Store full documentation in Pinecone after AI analysis
  async storeFullDocumentationInPinecone(
    documentation: {
      title: string;
      content: string;
      type:
        | 'codebase-analysis'
        | 'documentation'
        | 'feature-spec'
        | 'user-guide'
        | 'api-docs'
        | 'workflow'
        | 'ai-insights';
      category: string;
      tags: string[];
      source: string;
      version: string;
      timestamp: string;
      ai_model?: string;
      file_path?: string;
      line_numbers?: string;
      complexity?: 'low' | 'medium' | 'high';
      priority?: 'low' | 'medium' | 'high' | 'critical';
    }[]
  ) {
    try {
      // Use the new Pinecone service function to store and replace documentation
      const result =
        await pineconeService.storeComprehensiveDocumentationAndReplace(
          documentation
        );

      console.log(
        `✅ Stored ${result.totalDocumentsStored} new documentation chunks in Pinecone, replacing old documentation`
      );

      return result;
    } catch (error) {
      console.error('❌ Error storing full documentation in Pinecone:', error);
      throw error;
    }
  },

  // AI Insights & Perplexity Management Functions
  createAIInsight: async (insight: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .insert(insight)
      .select()
      .single();
    return { data, error };
  },

  getAIInsights: async (userId: string, filters?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    let query = supabase
      .from('ai_insights_perplexity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.search) {
      query = query.textSearch('search_vector', filters.search);
    }

    const { data, error } = await query;
    return { data, error };
  },

  updateAIInsight: async (insightId: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .update(updates)
      .eq('id', insightId)
      .select()
      .single();
    return { data, error };
  },

  deleteAIInsight: async (insightId: string) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .delete()
      .eq('id', insightId);
    return { data, error };
  },

  getAIInsightsSummary: async (userId: string) => {
    const { data, error } = await supabase
      .from('ai_insights_summary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  searchAIInsights: async (userId: string, searchQuery: string) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .select('*')
      .eq('user_id', userId)
      .textSearch('search_vector', searchQuery)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

// Export the database service functions
export const db = {
  createAIInsight: async (insight: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .insert(insight)
      .select()
      .single();
    return { data, error };
  },

  getAIInsights: async (userId: string, filters?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    let query = supabase
      .from('ai_insights_perplexity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.search) {
      query = query.textSearch('search_vector', filters.search);
    }

    const { data, error } = await query;
    return { data, error };
  },

  updateAIInsight: async (insightId: string, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .update(updates)
      .eq('id', insightId)
      .select()
      .single();
    return { data, error };
  },

  deleteAIInsight: async (insightId: string) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .delete()
      .eq('id', insightId);
    return { data, error };
  },

  getAIInsightsSummary: async (userId: string) => {
    const { data, error } = await supabase
      .from('ai_insights_summary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  searchAIInsights: async (userId: string, searchQuery: string) => {
    const { data, error } = await supabase
      .from('ai_insights_perplexity')
      .select('*')
      .eq('user_id', userId)
      .textSearch('search_vector', searchQuery)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};
