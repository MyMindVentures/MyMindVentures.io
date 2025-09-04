-- Add PDF support to AI Insights table
-- This migration adds PDF storage capabilities to the existing ai_insights_perplexity table

-- Add PDF-related columns
ALTER TABLE ai_insights_perplexity 
ADD COLUMN IF NOT EXISTS pdf_content BYTEA,
ADD COLUMN IF NOT EXISTS pdf_filename TEXT,
ADD COLUMN IF NOT EXISTS pdf_size INTEGER,
ADD COLUMN IF NOT EXISTS pdf_mime_type TEXT DEFAULT 'application/pdf',
ADD COLUMN IF NOT EXISTS pdf_created_at TIMESTAMP WITH TIME ZONE;

-- Create index for PDF content
CREATE INDEX IF NOT EXISTS idx_ai_insights_pdf ON ai_insights_perplexity(pdf_content) WHERE pdf_content IS NOT NULL;

-- Create view for PDF summary
CREATE OR REPLACE VIEW ai_insights_pdf_summary AS
SELECT 
  id,
  title,
  description,
  category,
  priority,
  status,
  pdf_filename,
  pdf_size,
  pdf_created_at,
  created_at,
  updated_at
FROM ai_insights_perplexity
WHERE pdf_content IS NOT NULL
ORDER BY created_at DESC;

-- Update the existing summary view to include PDF info
CREATE OR REPLACE VIEW ai_insights_summary AS
SELECT 
  id,
  title,
  description,
  category,
  priority,
  status,
  is_implemented,
  tags,
  pdf_filename,
  pdf_size,
  created_at,
  updated_at
FROM ai_insights_perplexity
ORDER BY created_at DESC;

-- Grant permissions on new view
GRANT SELECT ON ai_insights_pdf_summary TO authenticated;

-- Update existing sample data to include PDF filename (without actual PDF content)
UPDATE ai_insights_perplexity 
SET pdf_filename = 'PWA_Performance_Strategy.pdf',
    pdf_size = 0,
    pdf_mime_type = 'application/pdf',
    pdf_created_at = NOW()
WHERE title = 'PWA Performance Optimization Strategy'
AND pdf_filename IS NULL;

-- Create function to generate PDF filename from title
CREATE OR REPLACE FUNCTION generate_pdf_filename(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN REPLACE(
    REPLACE(
      REPLACE(title, ' ', '_'),
      ':', '_'
    ),
    '/', '_'
  ) || '.pdf';
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION generate_pdf_filename(TEXT) TO authenticated;
