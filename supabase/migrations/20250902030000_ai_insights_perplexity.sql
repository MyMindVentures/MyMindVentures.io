-- Create AI Insights & Perplexity Prompts table
-- This table stores all AI-generated insights, prompts, and responses from Perplexity.ai
-- related to PWA development, architecture decisions, and technical guidance

CREATE TABLE IF NOT EXISTS ai_insights_perplexity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core insight information
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- Full AI response content
  prompt TEXT NOT NULL, -- The original prompt/question
  
  -- Categorization
  category TEXT NOT NULL CHECK (category IN (
    'pwa-architecture',
    'performance-optimization', 
    'user-experience',
    'code-quality',
    'testing-strategy',
    'deployment',
    'security',
    'accessibility',
    'feature-planning',
    'bug-resolution',
    'code-refactoring',
    'documentation',
    'best-practices',
    'technology-selection',
    'scalability',
    'monitoring',
    'other'
  )),
  
  -- Priority and status
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'implemented', 'archived', 'deprecated')),
  
  -- AI model information
  ai_model TEXT DEFAULT 'perplexity-ai',
  model_version TEXT,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Implementation tracking
  is_implemented BOOLEAN DEFAULT FALSE,
  implementation_notes TEXT,
  implementation_date TIMESTAMP WITH TIME ZONE,
  
  -- Related code/files
  related_files TEXT[], -- Array of file paths
  related_components TEXT[], -- Array of component names
  related_features TEXT[], -- Array of feature names
  
  -- Tags for easy searching
  tags TEXT[] DEFAULT '{}',
  
  -- Metadata
  source TEXT DEFAULT 'perplexity-ai',
  conversation_context TEXT, -- Context from the conversation
  follow_up_questions TEXT[], -- Suggested follow-up questions
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(tags, ' ')), 'D')
  ) STORED
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights_perplexity(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_category ON ai_insights_perplexity(category);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON ai_insights_perplexity(status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority ON ai_insights_perplexity(priority);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights_perplexity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_search ON ai_insights_perplexity USING GIN(search_vector);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_ai_insights_fulltext ON ai_insights_perplexity USING GIN(search_vector);

-- Enable Row Level Security
ALTER TABLE ai_insights_perplexity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI insights" ON ai_insights_perplexity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI insights" ON ai_insights_perplexity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights" ON ai_insights_perplexity
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI insights" ON ai_insights_perplexity
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_ai_insights_updated_at
  BEFORE UPDATE ON ai_insights_perplexity
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_insights_updated_at();

-- Insert some sample data for demonstration
INSERT INTO ai_insights_perplexity (
  user_id,
  title,
  description,
  content,
  prompt,
  category,
  priority,
  tags,
  related_features
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'PWA Performance Optimization Strategy',
  'Comprehensive strategy for optimizing PWA performance using modern web technologies',
  'Based on your PWA requirements, here are the key performance optimization strategies:

1. **Service Worker Optimization**
   - Implement efficient caching strategies
   - Use Workbox for service worker management
   - Implement background sync for offline functionality

2. **Bundle Optimization**
   - Use code splitting and lazy loading
   - Implement tree shaking
   - Use modern bundlers like Vite or Webpack 5

3. **Image Optimization**
   - Implement responsive images with srcset
   - Use WebP format with fallbacks
   - Implement lazy loading for images

4. **Critical Rendering Path**
   - Inline critical CSS
   - Defer non-critical JavaScript
   - Optimize font loading

This approach should improve your PWA performance by 40-60%.',
  'What are the best strategies for optimizing PWA performance?',
  'performance-optimization',
  'high',
  ARRAY['pwa', 'performance', 'optimization', 'service-worker', 'bundle-optimization'],
  ARRAY['performance', 'caching', 'offline-support']
);

-- Create view for easy querying
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
  created_at,
  updated_at
FROM ai_insights_perplexity
ORDER BY created_at DESC;

-- Grant permissions
GRANT ALL ON ai_insights_perplexity TO authenticated;
GRANT SELECT ON ai_insights_summary TO authenticated;
