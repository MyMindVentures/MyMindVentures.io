/*
  # Documentation System Tables

  1. New Tables
    - `recovery_documentation`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `analysis_summary` (text)
      - `full_documentation` (text)
      - `navigation_map` (jsonb)
      - `component_map` (jsonb)
      - `file_inventory` (jsonb)
      - `user_flows` (jsonb)
      - `database_analysis` (jsonb)
      - `api_analysis` (jsonb)
      - `recovery_guide` (text)
      - `backup_file_url` (text)
      - `files_analyzed` (integer)
      - `commit_id` (uuid, optional)
      - `user_id` (text)
      - `created_at` (timestamptz)

    - `documentation_pages`
      - `id` (uuid, primary key)
      - `page_type` (text)
      - `title` (text)
      - `content` (text)
      - `version` (text)
      - `recovery_doc_id` (uuid)
      - `timestamp` (timestamptz)
      - `user_id` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for demo user access
*/

CREATE TABLE IF NOT EXISTS recovery_documentation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  analysis_summary text NOT NULL,
  full_documentation text NOT NULL,
  navigation_map jsonb DEFAULT '{}'::jsonb,
  component_map jsonb DEFAULT '{}'::jsonb,
  file_inventory jsonb DEFAULT '[]'::jsonb,
  user_flows jsonb DEFAULT '[]'::jsonb,
  database_analysis jsonb DEFAULT '{}'::jsonb,
  api_analysis jsonb DEFAULT '{}'::jsonb,
  recovery_guide text NOT NULL,
  backup_file_url text,
  files_analyzed integer DEFAULT 0,
  commit_id uuid,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documentation_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  version text DEFAULT 'v1.0.0',
  recovery_doc_id uuid,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recovery_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_pages ENABLE ROW LEVEL SECURITY;

-- Policies for recovery_documentation
CREATE POLICY "Authenticated users can manage their own recovery docs"
  ON recovery_documentation
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo recovery docs"
  ON recovery_documentation
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- Policies for documentation_pages
CREATE POLICY "Authenticated users can manage their own doc pages"
  ON documentation_pages
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo doc pages"
  ON documentation_pages
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- Add foreign key constraint
ALTER TABLE documentation_pages 
ADD CONSTRAINT documentation_pages_recovery_doc_fkey 
FOREIGN KEY (recovery_doc_id) REFERENCES recovery_documentation(id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_recovery_docs_user_timestamp 
ON recovery_documentation (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_doc_pages_user_type 
ON documentation_pages (user_id, page_type, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_doc_pages_recovery_doc 
ON documentation_pages (recovery_doc_id);