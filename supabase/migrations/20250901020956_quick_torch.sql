/*
  # Create Pitch Demo Tables

  1. New Tables
    - `pitch_content`
      - `id` (uuid, primary key)
      - `section_type` (text) - hero, features, testimonials, stats, etc.
      - `title` (text)
      - `content` (text)
      - `metadata` (jsonb) - additional data like stats, colors, etc.
      - `version` (text)
      - `generated_by_ai` (boolean)
      - `last_updated` (timestamp)
      - `user_id` (text)
      - `created_at` (timestamp)
    
    - `pitch_analytics`
      - `id` (uuid, primary key)
      - `visitor_id` (text)
      - `page_views` (integer)
      - `time_spent` (integer) - seconds
      - `features_viewed` (text[])
      - `cta_clicks` (integer)
      - `timestamp` (timestamp)
      - `user_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users and demo access
*/

CREATE TABLE IF NOT EXISTS pitch_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  version text DEFAULT 'v1.0.0',
  generated_by_ai boolean DEFAULT false,
  last_updated timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pitch_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_views integer DEFAULT 1,
  time_spent integer DEFAULT 0,
  features_viewed text[] DEFAULT '{}',
  cta_clicks integer DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pitch_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pitch_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for pitch_content
CREATE POLICY "Authenticated users can manage their own pitch content"
  ON pitch_content
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo pitch content"
  ON pitch_content
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

CREATE POLICY "Anyone can read pitch content"
  ON pitch_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for pitch_analytics
CREATE POLICY "Authenticated users can manage their own pitch analytics"
  ON pitch_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Demo user can manage demo pitch analytics"
  ON pitch_analytics
  FOR ALL
  TO anon, authenticated
  USING (user_id = 'demo-user')
  WITH CHECK (user_id = 'demo-user');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pitch_content_user_section ON pitch_content (user_id, section_type, last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_pitch_analytics_user_timestamp ON pitch_analytics (user_id, timestamp DESC);