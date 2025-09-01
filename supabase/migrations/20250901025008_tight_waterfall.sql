/*
  # Add Kevin's User Profile

  1. User Profile
    - Add Kevin (De Vlieger Kevin) as Founder/Creator
    - Email: hello@mymindventures.io
    - Phone: +34 643 037 346
    - Role: Founder/Creator
    - Access Level: Full Access
    - Company: MyMindVentures.io

  2. Security
    - User can access and update own profile
    - Demo policies remain for demo functionality
*/

-- Insert Kevin's user profile
INSERT INTO users (
  email,
  full_name,
  phone,
  role,
  access_level,
  location,
  company,
  avatar_url,
  bio,
  created_at,
  updated_at
) VALUES (
  'hello@mymindventures.io',
  'De Vlieger Kevin',
  '+34 643 037 346',
  'Founder/Creator',
  'Full Access',
  'Spain',
  'MyMindVentures.io',
  '',
  'Innovative developer with ADHD who has extraordinary blueprinting talents. Creator of revolutionary AI-powered development workflows and breakthrough technologies.',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  access_level = EXCLUDED.access_level,
  location = EXCLUDED.location,
  company = EXCLUDED.company,
  bio = EXCLUDED.bio,
  updated_at = now();