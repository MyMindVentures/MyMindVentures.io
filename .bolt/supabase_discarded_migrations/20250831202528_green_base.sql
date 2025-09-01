/*
  # Create blueprints table

  1. New Tables
    - `blueprints`
      - `id` (uuid, primary key)
      - `title` (text, generated title)
      - `description` (text, generated description)
      - `themes` (text array, combined themes)
      - `content` (text, blueprint content)
      - `status` (text, draft/ready/committed)
      - `user_id` (text, user identifier)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `blueprints` table
    - Add policy for authenticated users to manage their own blueprints

  3. Changes
    - Add constraint for status values
    - Add index for user queries
*/

CREATE TABLE IF NOT EXISTS blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  themes text[] DEFAULT '{}',
  content text NOT NULL,
  status text DEFAULT 'draft',
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blueprints"
  ON blueprints
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Add constraint for status values
ALTER TABLE blueprints 
ADD CONSTRAINT blueprints_status_check 
CHECK (status IN ('draft', 'ready', 'committed'));

-- Add index for user queries
CREATE INDEX IF NOT EXISTS idx_blueprints_user_status 
ON blueprints (user_id, status, created_at DESC);