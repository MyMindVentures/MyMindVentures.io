export interface AppDocumentationProps {
  onBack: () => void;
}

export interface RecoveryDocumentation {
  id: string;
  timestamp: string;
  analysis_summary: string;
  full_documentation: string;
  navigation_map: any;
  component_map: any;
  file_inventory: any[];
  user_flows: any[];
  database_analysis: any;
  api_analysis: any;
  recovery_guide: string;
  backup_file_url?: string;
  files_analyzed: number;
  commit_id?: string;
  created_at: string;
}

export interface DocumentationPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  version: string;
  recovery_doc_id: string;
  timestamp: string;
  created_at: string;
}

export interface GitStatus {
  branch: string;
  status: string;
  staged_files: string[];
  modified_files: string[];
  untracked_files: string[];
  commits: any[];
}

export type ViewType = 'documentation' | 'git' | 'history';
