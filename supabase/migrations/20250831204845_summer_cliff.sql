/*
  # Build Management System Schema

  1. New Tables
    - `blueprint_snippets` - Individual code snippets with branch tracking
    - `commits` - Development commits with full summaries
    - `publications` - Published versions with dates
    - `blueprint_files` - AI-generated complete app blueprints
    - `special_pages` - AI-analyzed special documentation pages

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Features
    - Complete timeline tracking
    - AI-generated content management
    - Branch-based development workflow
    - Version control integration
*/

-- Blueprint Snippets Table
CREATE TABLE IF NOT EXISTS blueprint_snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  branch text NOT NULL DEFAULT 'main',
  snippet text NOT NULL,
  title text,
  themes text[] DEFAULT '{}',
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blueprint_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blueprint snippets"
  ON blueprint_snippets
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Commits Table
CREATE TABLE IF NOT EXISTS commits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  branch text NOT NULL DEFAULT 'main',
  title text NOT NULL,
  description text NOT NULL,
  full_summary text NOT NULL,
  snippet_ids uuid[] DEFAULT '{}',
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own commits"
  ON commits
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Publications Table
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  version text NOT NULL,
  title text,
  description text,
  commit_id uuid,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own publications"
  ON publications
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Blueprint Files Table (AI-generated complete app blueprints)
CREATE TABLE IF NOT EXISTS blueprint_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  content text NOT NULL,
  generated_from_commit_id uuid,
  analysis_summary text,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blueprint_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blueprint files"
  ON blueprint_files
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Special Pages Table (AI-analyzed documentation)
CREATE TABLE IF NOT EXISTS special_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('app_architecture', 'userflow_pipelines', 'database_management', 'toolstack_overview', 'user_guide')),
  title text NOT NULL,
  content text NOT NULL,
  analysis_summary text,
  last_commit_analyzed uuid,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE special_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own special pages"
  ON special_pages
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'publications_commit_id_fkey'
  ) THEN
    ALTER TABLE publications ADD CONSTRAINT publications_commit_id_fkey 
    FOREIGN KEY (commit_id) REFERENCES commits(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'blueprint_files_commit_id_fkey'
  ) THEN
    ALTER TABLE blueprint_files ADD CONSTRAINT blueprint_files_commit_id_fkey 
    FOREIGN KEY (generated_from_commit_id) REFERENCES commits(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'special_pages_commit_id_fkey'
  ) THEN
    ALTER TABLE special_pages ADD CONSTRAINT special_pages_commit_id_fkey 
    FOREIGN KEY (last_commit_analyzed) REFERENCES commits(id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blueprint_snippets_user_timestamp 
  ON blueprint_snippets (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_commits_user_timestamp 
  ON commits (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_publications_user_date 
  ON publications (user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_blueprint_files_user_timestamp 
  ON blueprint_files (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_special_pages_user_updated 
  ON special_pages (user_id, updated_at DESC);