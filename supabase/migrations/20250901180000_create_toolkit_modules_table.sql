-- Create toolkit_modules table for dynamic State of Art Developer Toolkit
CREATE TABLE IF NOT EXISTS toolkit_modules (
  id BIGSERIAL PRIMARY KEY,
  module_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('validation', 'monitoring', 'debugging', 'ai', 'automation')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  config JSONB DEFAULT '{}',
  dependencies TEXT[] DEFAULT '{}',
  ai_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_toolkit_modules_user_id ON toolkit_modules(user_id);
CREATE INDEX IF NOT EXISTS idx_toolkit_modules_category ON toolkit_modules(category);
CREATE INDEX IF NOT EXISTS idx_toolkit_modules_status ON toolkit_modules(status);
CREATE INDEX IF NOT EXISTS idx_toolkit_modules_ai_enabled ON toolkit_modules(ai_enabled);

-- Enable Row Level Security
ALTER TABLE toolkit_modules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own toolkit modules" ON toolkit_modules
  FOR SELECT USING (user_id = current_user OR current_user = 'demo-user');

CREATE POLICY "Users can insert their own toolkit modules" ON toolkit_modules
  FOR INSERT WITH CHECK (user_id = current_user OR current_user = 'demo-user');

CREATE POLICY "Users can update their own toolkit modules" ON toolkit_modules
  FOR UPDATE USING (user_id = current_user OR current_user = 'demo-user');

CREATE POLICY "Users can delete their own toolkit modules" ON toolkit_modules
  FOR DELETE USING (user_id = current_user OR current_user = 'demo-user');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_toolkit_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_toolkit_modules_updated_at
  BEFORE UPDATE ON toolkit_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_toolkit_modules_updated_at();

-- Insert sample toolkit modules for demo
INSERT INTO toolkit_modules (user_id, name, description, category, status, config, dependencies, ai_enabled) VALUES
('demo-user', 'Icon Validation System', 'Dynamic icon validation with AI-powered suggestions', 'validation', 'active', '{"autoFix": true, "aiSuggestions": true}', ARRAY['lucide-react', 'typescript'], true),
('demo-user', 'AI Code Analyzer', 'AI-powered code analysis and optimization suggestions', 'ai', 'active', '{"analysisDepth": "deep", "autoOptimize": false}', ARRAY['typescript', 'eslint'], true),
('demo-user', 'Smart Dependency Monitor', 'Intelligent dependency tracking with security alerts', 'monitoring', 'active', '{"autoUpdate": false, "securityScan": true}', ARRAY['npm', 'audit'], true),
('demo-user', 'Performance Tracker', 'Real-time performance monitoring with AI insights', 'monitoring', 'inactive', '{"metrics": ["build-time", "bundle-size", "runtime"]}', ARRAY['vite', 'webpack'], true),
('demo-user', 'Security Scanner', 'AI-powered security vulnerability detection', 'ai', 'inactive', '{"scanDepth": "comprehensive", "autoFix": false}', ARRAY['npm-audit', 'snyk'], true),
('demo-user', 'Build Optimizer', 'AI-driven build optimization and caching', 'automation', 'inactive', '{"cacheStrategy": "aggressive", "parallelBuilds": true}', ARRAY['vite', 'esbuild'], true),
('demo-user', 'Code Quality Monitor', 'Continuous code quality monitoring with AI insights', 'debugging', 'inactive', '{"qualityThreshold": 85, "autoSuggestions": true}', ARRAY['eslint', 'prettier'], true);

-- Add comments for documentation
COMMENT ON TABLE toolkit_modules IS 'Dynamic modules for State of Art Developer Toolkit that can grow with the codebase';
COMMENT ON COLUMN toolkit_modules.module_id IS 'Unique identifier for the module';
COMMENT ON COLUMN toolkit_modules.category IS 'Module category: validation, monitoring, debugging, ai, automation';
COMMENT ON COLUMN toolkit_modules.status IS 'Module status: active, inactive, error';
COMMENT ON COLUMN toolkit_modules.config IS 'JSON configuration for the module';
COMMENT ON COLUMN toolkit_modules.dependencies IS 'Array of dependencies required by the module';
COMMENT ON COLUMN toolkit_modules.ai_enabled IS 'Whether the module uses AI capabilities';
