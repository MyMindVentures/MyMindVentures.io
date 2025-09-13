# AI Documentation Workflow

## 📋 Overview

The AI Documentation Workflow handles AI-powered codebase analysis and documentation generation. It uses Supabase Edge Functions to scan the codebase and generate comprehensive recovery documentation and documentation pages.

## 🎯 Purpose

- **Automated Documentation**: Generate comprehensive documentation from codebase analysis
- **Recovery Documentation**: Create detailed recovery guides for project restoration
- **AI-Powered Analysis**: Use OpenAI to analyze code structure and generate insights
- **Real-time Updates**: Keep documentation synchronized with codebase changes

## ✨ Features

### Core Functionality
- **Codebase Scanning**: Comprehensive analysis of project files and structure
- **AI Analysis**: OpenAI-powered code analysis and documentation generation
- **Recovery Documentation**: Detailed guides for project recovery and setup
- **Documentation Pages**: Auto-generated documentation pages with different types
- **Version Control Integration**: Track documentation changes with commits

### Advanced Features
- **Incremental Scanning**: Support for full, incremental, and targeted scans
- **Backup Generation**: Automatic backup file creation with timestamps
- **Multi-format Support**: Generate documentation in various formats
- **Real-time Processing**: Live updates during documentation generation

## 🗄️ Database Tables

### `recovery_documentation`
```sql
CREATE TABLE recovery_documentation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  analysis_summary text NOT NULL,
  full_documentation text NOT NULL,
  navigation_map jsonb DEFAULT '{}'::jsonb,
  component_map jsonb DEFAULT '{}'::jsonb,
  file_inventory jsonb DEFAULT '[]'::jsonb,
  user_flows jsonb DEFAULT '[]'::jsonb,
  database_analysis jsonb DEFAULT '{}'::jsonb,
  api_analysis jsonb DEFAULT '{}'::jsonb,
  recovery_guide text NOT NULL,
  backup_file_url text,
  files_analyzed integer DEFAULT 0,
  commit_id uuid,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### `documentation_pages`
```sql
CREATE TABLE documentation_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  version text NOT NULL,
  recovery_doc_id uuid,
  timestamp timestamptz DEFAULT now(),
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Workflow Configuration
```typescript
interface AIDocumentationWorkflowConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openaiApiKey?: string;
  defaultUserId?: string;
}
```

## 🚀 Implementation

### 1. Initialize Workflow
```typescript
import { AIDocumentationWorkflow } from './ai-documentation-workflow';

const workflow = new AIDocumentationWorkflow({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  defaultUserId: 'demo-user'
});
```

### 2. Generate Documentation
```typescript
const result = await workflow.generateCompleteDocumentation({
  user_id: 'demo-user',
  scan_type: 'full',
  generate_commit: true,
  commit_message: 'Update documentation'
});

if (result.success) {
  console.log('Documentation generated successfully');
  console.log(`Files scanned: ${result.files_scanned}`);
  console.log(`Pages updated: ${result.pages_updated}`);
}
```

### 3. Load Documentation
```typescript
// Load recovery documentation
const recoveryDocs = await workflow.loadRecoveryDocumentation('demo-user');

// Load documentation pages
const docPages = await workflow.loadDocumentationPages('demo-user');
```

## 📊 Workflow Steps

### 1. **Codebase Scanning**
- Scan all project files and directories
- Analyze file types and relationships
- Generate file inventory with metadata

### 2. **AI Analysis**
- Send codebase data to OpenAI for analysis
- Generate comprehensive documentation
- Create navigation and component maps

### 3. **Documentation Generation**
- Create recovery documentation
- Generate specialized documentation pages
- Update existing documentation

### 4. **Database Storage**
- Store recovery documentation in Supabase
- Update documentation pages
- Create backup files

### 5. **Commit Generation** (Optional)
- Generate Git commit with documentation changes
- Include commit message and metadata

## 🔄 API Endpoints

### Supabase Edge Function: `/functions/v1/scan-codebase`

**Request:**
```json
{
  "user_id": "demo-user",
  "scan_type": "full",
  "generate_commit": true,
  "commit_message": "Update documentation"
}
```

**Response:**
```json
{
  "success": true,
  "documentation": { /* generated documentation */ },
  "recovery_doc_id": "uuid",
  "backup_data": { /* backup information */ },
  "backup_filename": "mymindventures-recovery-2024-01-01T12-00-00.json",
  "commit_data": { /* commit information */ },
  "files_scanned": 150,
  "pages_updated": 5,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 📝 Documentation Types

### Recovery Documentation
- **Analysis Summary**: High-level overview of the codebase
- **Full Documentation**: Comprehensive technical documentation
- **Navigation Map**: File and component relationships
- **Component Map**: Component hierarchy and dependencies
- **File Inventory**: Complete list of files with metadata
- **User Flows**: Application user journey documentation
- **Database Analysis**: Database schema and relationships
- **API Analysis**: API endpoints and documentation
- **Recovery Guide**: Step-by-step recovery instructions

### Documentation Pages
- **App Architecture**: System architecture documentation
- **User Flow Pipelines**: User journey and flow documentation
- **Database Management**: Database schema and management
- **Toolstack Overview**: Technology stack documentation
- **User Guide**: End-user documentation

## 🛠️ Utility Functions

### Validation
```typescript
const isValidRequest = validateScanRequest({
  user_id: 'demo-user',
  scan_type: 'full'
});
```

### Workflow Status
```typescript
const status = await workflow.getWorkflowStatus();
console.log(`Total docs: ${status.totalDocs}`);
console.log(`Total pages: ${status.totalPages}`);
```

## 🔍 Error Handling

### Common Errors
- **Invalid Configuration**: Missing required environment variables
- **Supabase Connection**: Database connection issues
- **OpenAI API**: API key or rate limit issues
- **File System**: File access or permission issues

### Error Recovery
- Automatic retry for transient errors
- Fallback to cached documentation
- Graceful degradation for partial failures

## 📈 Performance Considerations

### Optimization Tips
- Use incremental scanning for large codebases
- Implement caching for frequently accessed documentation
- Batch database operations for better performance
- Monitor API rate limits and usage

### Monitoring
- Track documentation generation time
- Monitor file scan performance
- Log API usage and costs
- Track database query performance

## 🔐 Security

### Data Protection
- Row Level Security (RLS) enabled on all tables
- User-specific data isolation
- Secure API key management
- Input validation and sanitization

### Access Control
- User-based access to documentation
- API key rotation and management
- Audit logging for sensitive operations

## 🧪 Testing

### Test Scenarios
- Full codebase scan
- Incremental scan with changes
- Error handling and recovery
- Performance with large codebases
- API rate limiting

### Test Data
- Sample codebase for testing
- Mock API responses
- Test database with sample data

## 📚 Examples

### Basic Usage
```typescript
// Initialize workflow
const workflow = new AIDocumentationWorkflow();

// Generate documentation
const result = await workflow.generateCompleteDocumentation({
  user_id: 'user123',
  scan_type: 'full'
});

// Check results
if (result.success) {
  console.log('Success!', result.files_scanned, 'files processed');
}
```

### Advanced Configuration
```typescript
const workflow = new AIDocumentationWorkflow({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  openaiApiKey: 'your-openai-key',
  defaultUserId: 'admin'
});
```

## 🔗 Related Workflows

- **Pre-Commit Workflow**: Integrates with documentation updates
- **Build Logs Workflow**: Logs documentation generation events
- **Special Pages Workflow**: Manages specialized documentation pages

---

*This workflow is part of the MyMindVentures.io workflow collection. For more information, see the main [README](./README.md).*
