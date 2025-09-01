/*
  # Initial Schema for MyMindVentures.io

  1. New Tables
    - `prompts` - Store AI prompts with titles and content
    - `changelogs` - Track changes and updates with timestamps
    - `git_commits` - Store commit information with related changelogs
    - `app_sections` - Manage different app sections and their status
    - `feedback` - Collect user feedback and suggestions
    - `api_connections` - Track external API connection status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Indexes
    - Add indexes on user_id and timestamp columns for performance
*/

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create changelogs table
CREATE TABLE IF NOT EXISTS changelogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  prompt_id uuid REFERENCES prompts(id),
  created_at timestamptz DEFAULT now()
);

-- Create git_commits table
CREATE TABLE IF NOT EXISTS git_commits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  summary text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  changelog_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create app_sections table
CREATE TABLE IF NOT EXISTS app_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text CHECK (status IN ('planned', 'in_progress', 'completed')) DEFAULT 'planned',
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  type text CHECK (type IN ('suggestion', 'feedback', 'bug_report')) DEFAULT 'feedback',
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  page_context text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create api_connections table
CREATE TABLE IF NOT EXISTS api_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  api_key_encrypted text,
  status text CHECK (status IN ('connected', 'disconnected', 'error')) DEFAULT 'disconnected',
  last_tested timestamptz,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE git_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for prompts
CREATE POLICY "Users can manage their own prompts"
  ON prompts
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for changelogs
CREATE POLICY "Users can manage their own changelogs"
  ON changelogs
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for git_commits
CREATE POLICY "Users can manage their own commits"
  ON git_commits
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for app_sections
CREATE POLICY "Users can manage their own app sections"
  ON app_sections
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for feedback
CREATE POLICY "Users can manage their own feedback"
  ON feedback
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create policies for api_connections
CREATE POLICY "Users can manage their own API connections"
  ON api_connections
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_timestamp ON prompts(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_changelogs_user_timestamp ON changelogs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_commits_user_timestamp ON git_commits(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_timestamp ON feedback(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_connections_user ON api_connections(user_id);

-- Insert default app sections
INSERT INTO app_sections (name, description, status, user_id) VALUES
  ('AppArchitecture', 'Complete menu & page tree, flow overviews, user journeys', 'planned', 'demo-user'),
  ('Toolstack Overview', 'Settings, credentials, APIs management', 'planned', 'demo-user'),
  ('UserFlow/Pipeline Overview', 'Workflow and pipeline visualization', 'planned', 'demo-user'),
  ('AppUserGuide', 'User documentation and guides', 'planned', 'demo-user'),
  ('Workflows App Developer', 'Developer workflow automation', 'planned', 'demo-user'),
  ('App Build AI Prompts', 'AI prompts overview and management', 'planned', 'demo-user'),
  ('Database Monitor', 'Database health and performance monitoring', 'planned', 'demo-user'),
  ('API & Token Monitor', 'API connections and token management', 'planned', 'demo-user')
ON CONFLICT DO NOTHING;