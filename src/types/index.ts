export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  access_level: string;
  location: string;
  company: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  user_id: string;
}

export interface Changelog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  user_id: string;
  prompt_id?: string;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  themes: string[];
  content: string;
  status: 'draft' | 'ready' | 'committed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface BlueprintSnippet {
  id: string;
  timestamp: string;
  branch: string;
  snippet: string;
  title?: string;
  themes: string[];
  user_id: string;
  created_at: string;
}

export interface Commit {
  id: string;
  timestamp: string;
  branch: string;
  title: string;
  description: string;
  full_summary: string;
  snippet_ids: string[];
  user_id: string;
  created_at: string;
}

export interface Publication {
  id: string;
  date: string;
  version: string;
  title?: string;
  description?: string;
  commit_id?: string;
  user_id: string;
  created_at: string;
}

export interface BlueprintFile {
  id: string;
  timestamp: string;
  content: string;
  generated_from_commit_id?: string;
  analysis_summary?: string;
  user_id: string;
  created_at: string;
}

export interface SpecialPage {
  id: string;
  page_type: 'app_architecture' | 'userflow_pipelines' | 'database_management' | 'toolstack_overview' | 'user_guide';
  title: string;
  content: string;
  analysis_summary?: string;
  last_commit_analyzed?: string;
  timestamp: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
export interface GitCommit {
  id: string;
  title: string;
  description: string;
  summary: string;
  timestamp: string;
  user_id: string;
  changelog_ids: string[];
}

export interface AppSection {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  content: string;
  type: 'suggestion' | 'feedback' | 'bug_report';
  timestamp: string;
  user_id: string;
  page_context: string;
}

export interface APIConnection {
  id: string;
  service_name: string;
  api_key_encrypted: string;
  status: 'connected' | 'disconnected' | 'error';
  last_tested: string;
  user_id: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface SidebarState {
  isCollapsed: boolean;
  selectedTab: string;
}