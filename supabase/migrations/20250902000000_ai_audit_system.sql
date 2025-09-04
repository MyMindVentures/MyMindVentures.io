-- AI Codebase Audit & Suggestions System
-- Migration: 20250902000000_ai_audit_system.sql

-- AI Audit Suggestions Table
CREATE TABLE IF NOT EXISTS ai_audit_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'performance', 'security', 'architecture', 'user-experience', 
        'code-quality', 'testing', 'monitoring', 'deployment', 
        'accessibility', 'seo', 'pwa', 'ai-integration', 
        'multi-ide-collaboration', 'git-workflow'
    )),
    priority TEXT NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    solution TEXT NOT NULL,
    impact TEXT NOT NULL CHECK (impact IN ('major', 'moderate', 'minor')),
    effort TEXT NOT NULL CHECK (effort IN ('high', 'medium', 'low')),
    estimated_time TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    ai_confidence INTEGER NOT NULL CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'implemented', 'rejected', 'archived')),
    implementation_notes TEXT,
    implemented_at TIMESTAMP WITH TIME ZONE,
    ide_specific TEXT CHECK (ide_specific IN ('bolt-ai', 'cursor-ai', 'both', 'general')),
    git_integration BOOLEAN DEFAULT false,
    team_collaboration BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Codebase Analyses Table
CREATE TABLE IF NOT EXISTS ai_codebase_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id TEXT UNIQUE NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN (
        'full-audit', 'performance-review', 'security-audit', 
        'architecture-review', 'pwa-optimization', 'multi-ide-audit'
    )),
    summary TEXT NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    metrics JSONB NOT NULL DEFAULT '{}',
    findings JSONB NOT NULL DEFAULT '[]',
    recommendations JSONB NOT NULL DEFAULT '[]',
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Implementations Table
CREATE TABLE IF NOT EXISTS ai_implementations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    implementation_id TEXT UNIQUE NOT NULL,
    suggestion_id TEXT REFERENCES ai_audit_suggestions(suggestion_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    changes_made TEXT[] DEFAULT '{}',
    files_modified TEXT[] DEFAULT '{}',
    performance_impact JSONB NOT NULL DEFAULT '{}',
    before_metrics JSONB NOT NULL DEFAULT '{}',
    after_metrics JSONB NOT NULL DEFAULT '{}',
    implementation_time INTEGER NOT NULL, -- in minutes
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-IDE Collaboration Status Table
CREATE TABLE IF NOT EXISTS multi_ide_collaboration_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id TEXT NOT NULL,
    git_branch TEXT NOT NULL,
    last_commit_hash TEXT NOT NULL,
    last_commit_message TEXT,
    pending_pull_requests INTEGER DEFAULT 0,
    merge_conflicts INTEGER DEFAULT 0,
    team_members JSONB NOT NULL DEFAULT '[]',
    ide_usage JSONB NOT NULL DEFAULT '{"bolt_ai": 0, "cursor_ai": 0}',
    collaboration_score INTEGER CHECK (collaboration_score >= 0 AND collaboration_score <= 100),
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Git Workflow Events Table
CREATE TABLE IF NOT EXISTS git_workflow_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'commit', 'push', 'pull_request', 'merge', 'conflict', 
        'branch_create', 'branch_delete', 'tag_create', 'review'
    )),
    branch_name TEXT NOT NULL,
    commit_hash TEXT,
    commit_message TEXT,
    author_name TEXT,
    author_email TEXT,
    ide_used TEXT CHECK (ide_used IN ('bolt-ai', 'cursor-ai', 'unknown')),
    metadata JSONB NOT NULL DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_user_id ON ai_audit_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_category ON ai_audit_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_priority ON ai_audit_suggestions(priority);
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_status ON ai_audit_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_ide_specific ON ai_audit_suggestions(ide_specific);
CREATE INDEX IF NOT EXISTS idx_ai_audit_suggestions_created_at ON ai_audit_suggestions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_codebase_analyses_user_id ON ai_codebase_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_codebase_analyses_type ON ai_codebase_analyses(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_codebase_analyses_created_at ON ai_codebase_analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_implementations_user_id ON ai_implementations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_implementations_suggestion_id ON ai_implementations(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_ai_implementations_created_at ON ai_implementations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_multi_ide_collaboration_user_id ON multi_ide_collaboration_status(user_id);
CREATE INDEX IF NOT EXISTS idx_multi_ide_collaboration_project_id ON multi_ide_collaboration_status(project_id);

CREATE INDEX IF NOT EXISTS idx_git_workflow_events_user_id ON git_workflow_events(user_id);
CREATE INDEX IF NOT EXISTS idx_git_workflow_events_type ON git_workflow_events(event_type);
CREATE INDEX IF NOT EXISTS idx_git_workflow_events_branch ON git_workflow_events(branch_name);
CREATE INDEX IF NOT EXISTS idx_git_workflow_events_created_at ON git_workflow_events(created_at DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_ai_audit_suggestions_updated_at 
    BEFORE UPDATE ON ai_audit_suggestions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_multi_ide_collaboration_updated_at 
    BEFORE UPDATE ON multi_ide_collaboration_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE ai_audit_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_codebase_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE multi_ide_collaboration_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE git_workflow_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own AI audit suggestions" ON ai_audit_suggestions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI audit suggestions" ON ai_audit_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI audit suggestions" ON ai_audit_suggestions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI codebase analyses" ON ai_codebase_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI codebase analyses" ON ai_codebase_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI implementations" ON ai_implementations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI implementations" ON ai_implementations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own multi-IDE collaboration status" ON multi_ide_collaboration_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own multi-IDE collaboration status" ON multi_ide_collaboration_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own multi-IDE collaboration status" ON multi_ide_collaboration_status
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own git workflow events" ON git_workflow_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own git workflow events" ON git_workflow_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert demo data for testing
INSERT INTO ai_audit_suggestions (
    suggestion_id, category, priority, title, description, reasoning, solution,
    impact, effort, estimated_time, tags, ai_confidence, status, user_id,
    ide_specific, git_integration, team_collaboration
) VALUES 
(
    'demo-suggestion-1',
    'multi-ide-collaboration',
    'critical',
    'Implement Multi-IDE Git Workflow',
    'Set up seamless collaboration between Bolt.ai and Cursor.ai developers',
    'Your team uses both Bolt.ai and Cursor.ai, but there''s no standardized workflow for collaboration. This leads to merge conflicts and inconsistent development practices.',
    'Create standardized Git workflow with branch naming conventions, commit message templates, and IDE-specific configurations. Implement pre-commit hooks that work across both IDEs.',
    'major',
    'high',
    '8-12 hours',
    ARRAY['git', 'workflow', 'collaboration', 'bolt-ai', 'cursor-ai'],
    98,
    'pending',
    '00000000-0000-0000-0000-000000000000',
    'both',
    true,
    true
),
(
    'demo-suggestion-2',
    'git-workflow',
    'high',
    'Automated Code Review Pipeline',
    'Set up AI-powered code review that works with both IDEs',
    'Manual code reviews are time-consuming and inconsistent across different IDEs. An automated pipeline would ensure quality standards regardless of which IDE is used.',
    'Integrate GitHub Actions with AI code review tools. Create IDE-specific extensions for Bolt.ai and Cursor.ai that provide real-time feedback and automated quality checks.',
    'major',
    'medium',
    '6-8 hours',
    ARRAY['code-review', 'automation', 'github-actions', 'ai'],
    95,
    'pending',
    '00000000-0000-0000-0000-000000000000',
    'both',
    true,
    true
);

-- Insert demo AI analysis
INSERT INTO ai_codebase_analyses (
    analysis_id, analysis_type, summary, overall_score, metrics, findings, recommendations, generated_at, user_id
) VALUES (
    'demo-analysis-1',
    'multi-ide-audit',
    'Comprehensive AI analysis of MyMindVentures.io PWA ecosystem optimized for Bolt.ai and Cursor.ai collaboration',
    89,
    '{"performance": 87, "security": 94, "accessibility": 82, "seo": 85, "pwa": 91, "code_quality": 93, "collaboration": 78, "git_workflow": 85}',
    '["Excellent foundation with modern tech stack", "Strong testing infrastructure", "Good security practices", "Areas for multi-IDE collaboration improvement", "Git workflow can be optimized for team collaboration", "AI integration opportunities across both IDEs"]',
    '["Implement Multi-IDE Git Workflow", "Set up Automated Code Review Pipeline", "Create IDE-Specific Performance Optimizations", "Implement Multi-IDE Security Scanning", "Develop Cross-IDE AI Assistant Integration"]',
    NOW(),
    '00000000-0000-0000-0000-000000000000'
);

-- Insert demo multi-IDE collaboration status
INSERT INTO multi_ide_collaboration_status (
    project_id, git_branch, last_commit_hash, last_commit_message, pending_pull_requests, merge_conflicts, team_members, ide_usage, collaboration_score, user_id
) VALUES (
    'mymindventures-pwa',
    'main',
    'abc123def456',
    'feat: implement multi-IDE collaboration system',
    3,
    1,
    '["You", "Dev1", "Dev2", "Dev3"]',
    '{"bolt_ai": 2, "cursor_ai": 2}',
    85,
    '00000000-0000-0000-0000-000000000000'
);


