-- Remove BlueprintSnippets System
-- This migration removes all BlueprintSnippets related tables and data
-- Since we now have full Git Management functionality

-- Drop BlueprintSnippets related tables
DROP TABLE IF EXISTS blueprint_snippets CASCADE;

-- Remove BlueprintSnippets related columns from commits table
ALTER TABLE commits DROP COLUMN IF EXISTS snippet_ids;

-- Clean up any remaining BlueprintSnippets references
-- Note: This migration removes the old BlueprintSnippets system
-- and replaces it with the new Git Management system

-- Verify cleanup
SELECT 'BlueprintSnippets system removed successfully' as status;
