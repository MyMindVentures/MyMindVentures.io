/*
  # Add metadata column to api_connections table

  1. Schema Changes
    - Add `metadata` column to `api_connections` table
      - Type: JSONB for flexible JSON storage
      - Default: Empty JSON object
      - Nullable: Yes (for backward compatibility)

  2. Purpose
    - Store additional API connection parameters (e.g., Pinecone environment, Supabase URL)
    - Enable flexible configuration storage for different API services
    - Support future API service expansions

  3. Notes
    - Uses IF NOT EXISTS pattern for safe migration
    - Backward compatible with existing records
    - Default empty JSON object for consistency
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'api_connections' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE api_connections ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;