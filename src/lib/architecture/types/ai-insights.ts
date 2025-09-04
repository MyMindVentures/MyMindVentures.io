import { BaseEntity } from './base';

export interface AIInsight extends BaseEntity {
  title: string;
  description: string;
  prompt: string;
  content: string;
  category: AIInsightCategory;
  priority: AIInsightPriority;
  status: AIInsightStatus;
  ai_model: string;
  tags: string[];
  user_id: string;
  
  // PDF related fields
  pdf_content?: Buffer;
  pdf_filename?: string;
  pdf_size?: number;
  pdf_mime_type?: string;
  pdf_created_at?: string;
  
  // Search and analytics
  search_vector?: string;
  view_count?: number;
  last_viewed_at?: string;
  
  // Workflow related
  workflow_status?: WorkflowStatus;
  assigned_to?: string;
  due_date?: string;
  completion_percentage?: number;
  
  // Metadata
  source_url?: string;
  external_id?: string;
  version?: string;
  dependencies?: string[];
  related_insights?: string[];
}

export type AIInsightCategory = 
  | 'pwa-development'
  | 'ai-workflow'
  | 'supabase-integration'
  | 'architecture'
  | 'testing'
  | 'deployment'
  | 'security'
  | 'performance'
  | 'accessibility'
  | 'internationalization'
  | 'monitoring'
  | 'documentation'
  | 'other';

export type AIInsightPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'urgent';

export type AIInsightStatus = 
  | 'draft'
  | 'active'
  | 'archived'
  | 'deprecated'
  | 'in-review'
  | 'approved'
  | 'rejected';

export type WorkflowStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'on-hold';

export interface AIInsightCreateRequest {
  title: string;
  description: string;
  prompt: string;
  content: string;
  category: AIInsightCategory;
  priority: AIInsightPriority;
  status: AIInsightStatus;
  ai_model: string;
  tags: string[];
  user_id: string;
  
  // Optional fields
  source_url?: string;
  external_id?: string;
  version?: string;
  dependencies?: string[];
  related_insights?: string[];
}

export interface AIInsightUpdateRequest {
  title?: string;
  description?: string;
  prompt?: string;
  content?: string;
  category?: AIInsightCategory;
  priority?: AIInsightPriority;
  status?: AIInsightStatus;
  ai_model?: string;
  tags?: string[];
  
  // Optional fields
  source_url?: string;
  external_id?: string;
  version?: string;
  dependencies?: string[];
  related_insights?: string[];
  workflow_status?: WorkflowStatus;
  assigned_to?: string;
  due_date?: string;
  completion_percentage?: number;
}

export interface AIInsightFilters {
  category?: AIInsightCategory;
  priority?: AIInsightPriority;
  status?: AIInsightStatus;
  ai_model?: string;
  user_id?: string;
  workflow_status?: WorkflowStatus;
  assigned_to?: string;
  tags?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface AIInsightSearchResult {
  id: string;
  title: string;
  description: string;
  category: AIInsightCategory;
  priority: AIInsightPriority;
  status: AIInsightStatus;
  ai_model: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  relevance_score?: number;
  matched_fields?: string[];
}

export interface AIInsightSummary {
  total: number;
  byCategory: Record<AIInsightCategory, number>;
  byStatus: Record<AIInsightStatus, number>;
  byPriority: Record<AIInsightPriority, number>;
  byModel: Record<string, number>;
  byWorkflowStatus: Record<WorkflowStatus, number>;
  recentCount: number; // Last 7 days
  pdfCount: number; // Insights with PDF content
  averageCompletion: number; // Average completion percentage
}

export interface AIInsightAnalytics {
  totalViews: number;
  averageViewsPerInsight: number;
  mostViewedInsights: Array<{
    id: string;
    title: string;
    viewCount: number;
  }>;
  categoryDistribution: Record<AIInsightCategory, {
    count: number;
    percentage: number;
    averageViews: number;
  }>;
  priorityDistribution: Record<AIInsightPriority, {
    count: number;
    percentage: number;
    averageViews: number;
  }>;
  workflowEfficiency: {
    averageCompletionTime: number;
    completionRate: number;
    bottlenecks: string[];
  };
  tagUsage: Array<{
    tag: string;
    count: number;
    percentage: number;
  }>;
}

export interface AIInsightExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeContent: boolean;
  includePDF: boolean;
  filters?: AIInsightFilters;
  dateRange?: {
    from: string;
    to: string;
  };
  fields?: (keyof AIInsight)[];
}

export interface AIInsightImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    warning: string;
  }>;
}

export interface AIInsightBulkOperation {
  operation: 'update' | 'delete' | 'archive' | 'change-status' | 'change-priority';
  insightIds: string[];
  updates?: Partial<AIInsightUpdateRequest>;
  newStatus?: AIInsightStatus;
  newPriority?: AIInsightPriority;
  reason?: string;
  user_id: string;
}

export interface AIInsightBulkOperationResult {
  operation: string;
  totalInsights: number;
  successful: number;
  failed: number;
  errors: Array<{
    insightId: string;
    error: string;
  }>;
  warnings: Array<{
    insightId: string;
    warning: string;
  }>;
}

export interface AIInsightWorkflowStep {
  id: string;
  insightId: string;
  stepName: string;
  stepOrder: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  duration?: number; // in milliseconds
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
  dependencies?: string[]; // IDs of steps that must complete first
}

export interface AIInsightWorkflow {
  id: string;
  insightId: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  currentStep?: number;
  totalSteps: number;
  steps: AIInsightWorkflowStep[];
  startedAt: string;
  completedAt?: string;
  totalDuration?: number; // in milliseconds
  createdBy: string;
  assignedTo?: string;
  priority: AIInsightPriority;
  dueDate?: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface AIInsightTemplate {
  id: string;
  name: string;
  description: string;
  category: AIInsightCategory;
  contentTemplate: string;
  promptTemplate: string;
  defaultTags: string[];
  defaultPriority: AIInsightPriority;
  defaultStatus: AIInsightStatus;
  requiredFields: (keyof AIInsight)[];
  optionalFields: (keyof AIInsight)[];
  validationRules?: Record<string, any>;
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}
