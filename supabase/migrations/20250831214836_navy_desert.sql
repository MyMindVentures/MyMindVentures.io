/*
  # Add commit tracking to blueprint snippets

  1. Schema Changes
    - Add `committed_at` column to `blueprint_snippets` table
    - Add `commit_id` column to `blueprint_snippets` table to track which commit they belong to
    - Add index for efficient querying of uncommitted snippets

  2. Security
    - Maintain existing RLS policies
    - No additional security changes needed
*/

-- Add commit tracking columns to blueprint_snippets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueprint_snippets' AND column_name = 'committed_at'
  ) THEN
    ALTER TABLE blueprint_snippets ADD COLUMN committed_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blueprint_snippets' AND column_name = 'commit_id'
  ) THEN
    ALTER TABLE blueprint_snippets ADD COLUMN commit_id uuid;
  END IF;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'blueprint_snippets_commit_id_fkey'
  ) THEN
    ALTER TABLE blueprint_snippets 
    ADD CONSTRAINT blueprint_snippets_commit_id_fkey 
    FOREIGN KEY (commit_id) REFERENCES commits(id);
  END IF;
END $$;

-- Add index for efficient querying of uncommitted snippets
CREATE INDEX IF NOT EXISTS idx_blueprint_snippets_uncommitted 
ON blueprint_snippets (user_id, committed_at) 
WHERE committed_at IS NULL;