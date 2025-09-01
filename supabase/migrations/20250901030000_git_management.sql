-- Git Management Tables
-- This migration adds tables for Git operations including commits, branches, and file status

-- Commits table
CREATE TABLE IF NOT EXISTS commits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    author TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    branch TEXT NOT NULL DEFAULT 'main',
    files_changed INTEGER DEFAULT 0,
    commit_hash TEXT,
    parent_commit_id UUID REFERENCES commits(id),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_current BOOLEAN DEFAULT FALSE,
    last_commit TEXT,
    ahead_count INTEGER DEFAULT 0,
    behind_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File status table
CREATE TABLE IF NOT EXISTS file_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL,
    status TEXT CHECK (status IN ('modified', 'added', 'deleted', 'untracked', 'committed')) NOT NULL,
    staged BOOLEAN DEFAULT FALSE,
    branch TEXT NOT NULL DEFAULT 'main',
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Git repository settings
CREATE TABLE IF NOT EXISTS git_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    repository_url TEXT,
    access_token TEXT,
    default_branch TEXT DEFAULT 'main',
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_commits_branch ON commits(branch);
CREATE INDEX IF NOT EXISTS idx_commits_timestamp ON commits(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_file_status_branch ON file_status(branch);
CREATE INDEX IF NOT EXISTS idx_file_status_path ON file_status(path);
CREATE INDEX IF NOT EXISTS idx_branches_name ON branches(name);

-- Insert default main branch
INSERT INTO branches (name, is_current) VALUES ('main', TRUE) ON CONFLICT (name) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE git_settings ENABLE ROW LEVEL SECURITY;

-- Policies for commits
CREATE POLICY "Users can view their own commits" ON commits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commits" ON commits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commits" ON commits
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for branches
CREATE POLICY "Users can view their own branches" ON branches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branches" ON branches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branches" ON branches
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for file_status
CREATE POLICY "Users can view their own file status" ON file_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file status" ON file_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file status" ON file_status
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for git_settings
CREATE POLICY "Users can view their own git settings" ON git_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own git settings" ON git_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own git settings" ON git_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for git_settings
CREATE TRIGGER update_git_settings_updated_at 
    BEFORE UPDATE ON git_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
