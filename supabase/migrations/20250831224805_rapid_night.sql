/*
  # Fix all RLS policies for demo-user access

  1. Problem
    - All tables have RLS policies that only work with authenticated users (auth.uid())
    - Demo-user is hardcoded as 'demo-user' string, not an authenticated user
    - This causes 401 errors on all database operations

  2. Solution
    - Update all RLS policies to allow 'demo-user' operations
    - Keep existing authenticated user policies
    - Add demo-user specific policies for all tables

  3. Tables Updated
    - prompts
    - changelogs  
    - blueprint_snippets
    - commits
    - publications
    - blueprint_files
    - special_pages
    - app_build_log
    - feedback
    - api_connections
    - app_sections
    - blueprints

  4. Security
    - Demo-user can only access their own data (user_id = 'demo-user')
    - Authenticated users still use auth.uid() policies
    - No cross-user data access allowed
*/

-- Drop existing policies and create new ones that work for both demo-user and authenticated users

-- PROMPTS TABLE
DROP POLICY IF EXISTS "Users can manage their own prompts" ON prompts;

CREATE POLICY "Authenticated users can manage their own prompts"
  ON prompts
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo prompts"
  ON prompts
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- CHANGELOGS TABLE
DROP POLICY IF EXISTS "Users can manage their own changelogs" ON changelogs;

CREATE POLICY "Authenticated users can manage their own changelogs"
  ON changelogs
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo changelogs"
  ON changelogs
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- BLUEPRINT_SNIPPETS TABLE
DROP POLICY IF EXISTS "Users can manage their own blueprint snippets" ON blueprint_snippets;

CREATE POLICY "Authenticated users can manage their own blueprint snippets"
  ON blueprint_snippets
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo blueprint snippets"
  ON blueprint_snippets
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- COMMITS TABLE
DROP POLICY IF EXISTS "Users can manage their own commits" ON commits;

CREATE POLICY "Authenticated users can manage their own commits"
  ON commits
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo commits"
  ON commits
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- PUBLICATIONS TABLE
DROP POLICY IF EXISTS "Users can manage their own publications" ON publications;

CREATE POLICY "Authenticated users can manage their own publications"
  ON publications
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo publications"
  ON publications
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- BLUEPRINT_FILES TABLE
DROP POLICY IF EXISTS "Users can manage their own blueprint files" ON blueprint_files;

CREATE POLICY "Authenticated users can manage their own blueprint files"
  ON blueprint_files
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo blueprint files"
  ON blueprint_files
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- SPECIAL_PAGES TABLE
DROP POLICY IF EXISTS "Users can manage their own special pages" ON special_pages;

CREATE POLICY "Authenticated users can manage their own special pages"
  ON special_pages
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo special pages"
  ON special_pages
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- APP_BUILD_LOG TABLE
DROP POLICY IF EXISTS "Users can insert their own build logs" ON app_build_log;
DROP POLICY IF EXISTS "Users can read their own build logs" ON app_build_log;

CREATE POLICY "Authenticated users can manage their own build logs"
  ON app_build_log
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo build logs"
  ON app_build_log
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- FEEDBACK TABLE
DROP POLICY IF EXISTS "Users can manage their own feedback" ON feedback;

CREATE POLICY "Authenticated users can manage their own feedback"
  ON feedback
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo feedback"
  ON feedback
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- API_CONNECTIONS TABLE
DROP POLICY IF EXISTS "Users can manage their own API connections" ON api_connections;

CREATE POLICY "Authenticated users can manage their own API connections"
  ON api_connections
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo API connections"
  ON api_connections
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- APP_SECTIONS TABLE
DROP POLICY IF EXISTS "Users can manage their own app sections" ON app_sections;

CREATE POLICY "Authenticated users can manage their own app sections"
  ON app_sections
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo app sections"
  ON app_sections
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- BLUEPRINTS TABLE
DROP POLICY IF EXISTS "Users can manage their own blueprints" ON blueprints;

CREATE POLICY "Authenticated users can manage their own blueprints"
  ON blueprints
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo blueprints"
  ON blueprints
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');