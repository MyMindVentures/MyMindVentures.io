/*
  # Create users table and add Kevin's profile

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text)
      - `access_level` (text)
      - `location` (text)
      - `company` (text)
      - `avatar_url` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
    - Add policy for demo access

  3. Initial Data
    - Add Kevin's profile as founder/creator
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text DEFAULT '',
  role text DEFAULT 'user',
  access_level text DEFAULT 'standard',
  location text DEFAULT '',
  company text DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Demo user can access demo profile"
  ON users
  FOR ALL
  TO anon, authenticated
  USING (email = 'hello@mymindventures.io')
  WITH CHECK (email = 'hello@mymindventures.io');

-- Insert Kevin's profile
INSERT INTO users (
  email,
  full_name,
  phone,
  role,
  access_level,
  location,
  company,
  bio
) VALUES (
  'hello@mymindventures.io',
  'De Vlieger Kevin',
  '+34 643 037 346',
  'Founder/Creator',
  'Full Access',
  'Spain',
  'MyMindVentures.io',
  'Innovative developer with ADHD who has extraordinary blueprinting talents. Creator of revolutionary AI-powered development workflows that transform scattered thoughts into breakthrough innovations. Powered by collaboration with Perplexity.ai and Bolt.ai.'
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  access_level = EXCLUDED.access_level,
  location = EXCLUDED.location,
  company = EXCLUDED.company,
  bio = EXCLUDED.bio,
  updated_at = now();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);