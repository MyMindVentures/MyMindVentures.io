-- Create debug_logs table for comprehensive debugging and issue tracking
CREATE TABLE IF NOT EXISTS debug_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id TEXT NOT NULL UNIQUE, -- The generated debug log ID
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  category TEXT NOT NULL CHECK (category IN ('build', 'runtime', 'api', 'database', 'dependency', 'performance', 'security')),
  title TEXT NOT NULL,
  description TEXT,
  error_message TEXT,
  stack_trace TEXT,
  solution TEXT,
  steps_taken JSONB DEFAULT '[]'::jsonb,
  environment JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'investigating', 'closed')),
  resolution_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  related_issues TEXT[] DEFAULT '{}',
  prevention_notes TEXT,
  user_id TEXT DEFAULT 'demo-user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_debug_logs_severity ON debug_logs(severity);
CREATE INDEX IF NOT EXISTS idx_debug_logs_category ON debug_logs(category);
CREATE INDEX IF NOT EXISTS idx_debug_logs_status ON debug_logs(status);
CREATE INDEX IF NOT EXISTS idx_debug_logs_timestamp ON debug_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_debug_logs_user_id ON debug_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_debug_logs_tags ON debug_logs USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE debug_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own debug logs" ON debug_logs
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can insert their own debug logs" ON debug_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can update their own debug logs" ON debug_logs
  FOR UPDATE USING (auth.uid()::text = user_id OR user_id = 'demo-user');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_debug_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_debug_logs_updated_at
  BEFORE UPDATE ON debug_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_debug_logs_updated_at();

-- Insert some initial debug logs for common issues
INSERT INTO debug_logs (log_id, severity, category, title, description, status, tags, steps_taken, environment) VALUES
(
  'debug-20250901170000-001',
  'error',
  'build',
  'Lucide React Icons Build Error',
  'Build fails due to non-existent icons in lucide-react package. This is a common issue after package updates.',
  'resolved',
  ARRAY['icons', 'lucide-react', 'build', 'vite', 'rollup'],
  ARRAY['Identified problematic icons', 'Removed non-existent icons', 'Updated package-lock.json', 'Cleared npm cache'],
  '{"node_version": "v22.18.0", "npm_version": "latest", "package_versions": {"lucide-react": "0.344.0"}}'
),
(
  'debug-20250901170000-002',
  'warning',
  'dependency',
  'Browserslist Outdated Warning',
  'Browserslist database is outdated, causing build warnings.',
  'open',
  ARRAY['dependency', 'browserslist', 'build'],
  ARRAY['Identified outdated browserslist', 'Need to run npx update-browserslist-db@latest'],
  '{"node_version": "v22.18.0", "npm_version": "latest"}'
),
(
  'debug-20250901170000-003',
  'info',
  'performance',
  'Build Performance Optimization',
  'Build takes 6-7 seconds, could be optimized with better tree shaking and code splitting.',
  'open',
  ARRAY['performance', 'build', 'vite', 'optimization'],
  ARRAY['Identified build performance issues', 'Need to implement code splitting', 'Consider lazy loading'],
  '{"node_version": "v22.18.0", "npm_version": "latest", "package_versions": {"vite": "5.4.19"}}'
);

-- Grant permissions
GRANT ALL ON debug_logs TO authenticated;
GRANT SELECT ON debug_logs TO anon;
