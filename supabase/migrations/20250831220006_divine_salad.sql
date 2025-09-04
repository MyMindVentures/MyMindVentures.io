/*
  # Create App Build Log Table

  1. New Tables
    - `app_build_log`
      - `id` (uuid, primary key)
      - `action_type` (text) - Type of action: 'blueprint_snippet', 'commit', 'publication', 'blueprint_file', 'special_page'
      - `action_description` (text) - Human readable description of the action
      - `timestamp` (timestamptz) - When the action occurred
      - `user_id` (text) - User who performed the action
      - `related_id` (uuid) - ID of the related record (snippet, commit, etc.)
      - `metadata` (jsonb) - Additional data like themes, branch, version, etc.
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `app_build_log` table
    - Add policy for authenticated users to read their own logs
*/

CREATE TABLE IF NOT EXISTS app_build_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  action_description text NOT NULL,
  timestamp timestamptz NOT NULL,
  user_id text NOT NULL,
  related_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_app_build_log_user_timestamp 
ON app_build_log (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_app_build_log_action_type 
ON app_build_log (user_id, action_type, timestamp DESC);

-- Enable RLS
ALTER TABLE app_build_log ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own logs
CREATE POLICY "Users can read their own build logs"
  ON app_build_log
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own build logs"
  ON app_build_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);