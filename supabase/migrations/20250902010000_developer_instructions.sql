-- Developer Instructions & Documentation System
-- Migration: 20250902010000_developer_instructions.sql

-- Developer Instructions Table
CREATE TABLE IF NOT EXISTS developer_instructions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instruction_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'setup', 'workflow', 'configuration', 'best-practices', 
        'troubleshooting', 'deployment', 'testing', 'collaboration',
        'multi-ide', 'ai-integration', 'performance', 'security'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_time TEXT NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Guides Table
CREATE TABLE IF NOT EXISTS developer_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'multi-ide-collaboration', 'ai-workflow', 'pwa-development',
        'testing-strategy', 'deployment-pipeline', 'performance-optimization',
        'security-practices', 'code-quality', 'team-collaboration'
    )),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_time TEXT NOT NULL,
    prerequisites TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Documentation Table
CREATE TABLE IF NOT EXISTS developer_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doc_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'api-reference', 'component-library', 'architecture', 'database-schema',
        'configuration', 'environment-setup', 'deployment-guide', 'troubleshooting'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Activity Log Table
CREATE TABLE IF NOT EXISTS developer_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id TEXT UNIQUE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'instruction_viewed', 'guide_followed', 'documentation_accessed',
        'setup_completed', 'configuration_changed', 'workflow_started'
    )),
    instruction_id TEXT REFERENCES developer_instructions(instruction_id),
    guide_id TEXT REFERENCES developer_guides(guide_id),
    doc_id TEXT REFERENCES developer_documentation(doc_id),
    description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_developer_instructions_category ON developer_instructions(category);
CREATE INDEX IF NOT EXISTS idx_developer_instructions_difficulty ON developer_instructions(difficulty);
CREATE INDEX IF NOT EXISTS idx_developer_instructions_is_active ON developer_instructions(is_active);
CREATE INDEX IF NOT EXISTS idx_developer_instructions_is_featured ON developer_instructions(is_featured);
CREATE INDEX IF NOT EXISTS idx_developer_instructions_created_at ON developer_instructions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_guides_category ON developer_guides(category);
CREATE INDEX IF NOT EXISTS idx_developer_guides_difficulty ON developer_guides(difficulty);
CREATE INDEX IF NOT EXISTS idx_developer_guides_is_active ON developer_guides(is_active);
CREATE INDEX IF NOT EXISTS idx_developer_guides_is_featured ON developer_guides(is_featured);
CREATE INDEX IF NOT EXISTS idx_developer_guides_created_at ON developer_guides(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_documentation_category ON developer_documentation(category);
CREATE INDEX IF NOT EXISTS idx_developer_documentation_is_active ON developer_documentation(is_active);
CREATE INDEX IF NOT EXISTS idx_developer_documentation_is_featured ON developer_documentation(is_featured);
CREATE INDEX IF NOT EXISTS idx_developer_documentation_created_at ON developer_documentation(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_activity_log_type ON developer_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_developer_activity_log_created_at ON developer_activity_log(created_at DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_developer_instructions_updated_at 
    BEFORE UPDATE ON developer_instructions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developer_guides_updated_at 
    BEFORE UPDATE ON developer_guides 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developer_documentation_updated_at 
    BEFORE UPDATE ON developer_documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE developer_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view developer instructions" ON developer_instructions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert developer instructions" ON developer_instructions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update developer instructions" ON developer_instructions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view developer guides" ON developer_guides
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert developer guides" ON developer_guides
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update developer guides" ON developer_guides
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view developer documentation" ON developer_documentation
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert developer documentation" ON developer_documentation
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update developer documentation" ON developer_documentation
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity log" ON developer_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity log" ON developer_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert demo data for testing
INSERT INTO developer_instructions (
    instruction_id, category, title, description, content, difficulty, estimated_time, prerequisites, tags, user_id
) VALUES 
(
    'demo-instruction-1',
    'multi-ide',
    'Setup Multi-IDE Collaboration',
    'Configure Bolt.ai and Cursor.ai for seamless collaboration',
    '# Multi-IDE Collaboration Setup

## Overview
This guide will help you set up seamless collaboration between Bolt.ai and Cursor.ai for the MyMindVentures.io PWA project.

## Prerequisites
- Git installed and configured
- Access to both Bolt.ai and Cursor.ai
- Project repository cloned locally

## Steps

### 1. Configure Bolt.ai
```bash
# Install Bolt.ai extensions
npm run setup:bolt-ai

# Configure AI assistant
npm run configure:bolt-ai
```

### 2. Configure Cursor.ai
```bash
# Install Cursor.ai extensions
npm run setup:cursor-ai

# Configure AI assistant
npm run configure:cursor-ai
```

### 3. Setup Git Workflow
```bash
# Configure Git hooks
npm run setup:git-hooks

# Set commit message template
git config commit.template .gitmessage
```

### 4. Test Collaboration
```bash
# Run AI audit
npm run ai:audit

# Test multi-IDE workflow
npm run test:multi-ide
```

## Best Practices
- Use IDE-specific branch patterns
- Follow commit message conventions
- Regular sync meetings with team
- Monitor collaboration metrics

## Troubleshooting
If you encounter issues:
1. Check Git configuration
2. Verify IDE extensions
3. Review collaboration logs
4. Contact team lead',
    'intermediate',
    '30-45 minutes',
    ARRAY['Git basics', 'Node.js installed'],
    ARRAY['multi-ide', 'collaboration', 'setup', 'bolt-ai', 'cursor-ai'],
    '00000000-0000-0000-0000-000000000000'
),
(
    'demo-instruction-2',
    'ai-integration',
    'AI-Powered Development Workflow',
    'Learn how to use AI assistants effectively in your development process',
    '# AI-Powered Development Workflow

## Overview
Maximize your productivity with AI-powered development tools and workflows.

## AI Tools Integration

### 1. OpenAI API Setup
```typescript
// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### 2. AI Code Suggestions
- Use AI for code generation
- Implement intelligent autocomplete
- Leverage AI for refactoring

### 3. AI Testing
- Automated test generation
- AI-powered test optimization
- Intelligent test coverage analysis

## Best Practices
- Always review AI-generated code
- Use AI for repetitive tasks
- Maintain code quality standards
- Document AI-assisted changes

## Workflow Integration
1. Start with AI brainstorming
2. Generate initial code structure
3. Refine with human expertise
4. Test and validate
5. Document and share',
    'advanced',
    '1-2 hours',
    ARRAY['TypeScript', 'React basics'],
    ARRAY['ai', 'workflow', 'productivity', 'openai'],
    '00000000-0000-0000-0000-000000000000'
);

-- Insert demo guides
INSERT INTO developer_guides (
    guide_id, category, title, subtitle, description, content, difficulty, estimated_time, prerequisites, tags, user_id
) VALUES 
(
    'demo-guide-1',
    'multi-ide-collaboration',
    'Complete Multi-IDE Collaboration Guide',
    'Bolt.ai + Cursor.ai + Git Hub Workflow',
    'Comprehensive guide for seamless collaboration between Bolt.ai and Cursor.ai developers using Git as the central hub.',
    '# Multi-IDE Collaboration Guide

## 🎯 Overview
This guide provides a comprehensive setup for seamless collaboration between **Bolt.ai** and **Cursor.ai** developers using **Git** as the central hub.

## 🏗️ Architecture Overview
- Bolt.ai: AI-assisted coding, rapid prototyping
- Cursor.ai: Complex refactoring, architecture design
- Git Hub: Version control, collaboration, CI/CD

## 🚀 Quick Setup
1. Clone repository
2. Configure IDE-specific settings
3. Setup Git workflow
4. Test collaboration

## 🔧 Detailed Configuration
- Branch naming conventions
- Commit message templates
- Pre-commit hooks
- CI/CD pipeline integration

## 🤖 AI Integration Setup
- Shared AI context
- IDE-specific prompts
- Collaboration monitoring
- Performance metrics

## 📊 Monitoring & Analytics
- Collaboration dashboard
- Key metrics tracking
- Performance insights
- Optimization suggestions

## 🎯 Best Practices
- IDE-specific workflows
- Communication guidelines
- Code review processes
- Conflict resolution

## 🚀 Getting Started
- Quick start commands
- IDE-specific setup
- Testing procedures
- Deployment workflow',
    'intermediate',
    '2-3 hours',
    ARRAY['Git basics', 'React/TypeScript'],
    ARRAY['multi-ide', 'collaboration', 'workflow', 'bolt-ai', 'cursor-ai'],
    '00000000-0000-0000-0000-000000000000'
);

-- Insert demo documentation
INSERT INTO developer_documentation (
    doc_id, category, title, description, content, user_id
) VALUES 
(
    'demo-doc-1',
    'api-reference',
    'Supabase API Reference',
    'Complete reference for all Supabase services and functions used in the project.',
    '# Supabase API Reference

## Authentication
- `supabase.auth.signUp()`
- `supabase.auth.signIn()`
- `supabase.auth.signOut()`

## Database Operations
- `supabase.from().select()`
- `supabase.from().insert()`
- `supabase.from().update()`
- `supabase.from().delete()`

## Real-time Subscriptions
- `supabase.channel().on()`
- `supabase.channel().subscribe()`

## Storage
- `supabase.storage.from().upload()`
- `supabase.storage.from().download()`

## Functions
- `supabase.functions.invoke()`

## Examples
```typescript
// Query data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// Insert data
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'John', email: 'john@example.com' }]);

// Update data
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', userId);
```',
    '00000000-0000-0000-0000-000000000000'
);


