/*
  # Create blueprints table

  1. New Tables
    - `blueprints`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `themes` (text array, default empty)
      - `content` (text, optional)
      - `status` (text, default 'draft')
      - `user_id` (text, required)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `blueprints` table
    - Add policies for authenticated users to manage their own blueprints
*/

CREATE TABLE IF NOT EXISTS public.blueprints (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    themes text[] DEFAULT '{}'::text[],
    content text,
    status text DEFAULT 'draft' NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blueprints"
  ON public.blueprints
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Add status constraint
ALTER TABLE public.blueprints 
ADD CONSTRAINT blueprints_status_check 
CHECK (status IN ('draft', 'ready', 'committed'));

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_blueprints_user_created 
ON public.blueprints (user_id, created_at DESC);