# AI Insights Workflow

## 📋 Overview

The AI Insights Workflow handles AI insights management and processing, including PDF content handling and Perplexity.ai integration. It provides comprehensive AI insight creation, management, and analysis capabilities with advanced PDF processing and search functionality.

## 🎯 Purpose

- **AI Insights Management**: Create, store, and manage AI-generated insights
- **PDF Processing**: Handle PDF content extraction and analysis
- **Perplexity.ai Integration**: Leverage Perplexity.ai for enhanced insights
- **Content Analysis**: Analyze and categorize AI insights
- **Search & Discovery**: Advanced search capabilities for insights
- **Workflow Integration**: Connect insights with development workflows

## ✨ Features

### Core Functionality
- **AI Insight Creation**: Create and store AI insights with metadata
- **PDF Content Handling**: Extract and process PDF content
- **Content Analysis**: Analyze insight content and generate summaries
- **Categorization**: Organize insights by categories and tags
- **Priority Management**: Set and manage insight priorities
- **Status Tracking**: Track insight workflow status

### Advanced Features
- **Perplexity.ai Integration**: Enhanced AI analysis using Perplexity.ai
- **Search Functionality**: Full-text search across insights
- **Related Insights**: Connect related insights and suggestions
- **Template System**: Pre-defined insight templates
- **Bulk Operations**: Process multiple insights simultaneously
- **Export Capabilities**: Export insights in various formats

## 🗄️ Database Tables

### `ai_insights_perplexity`
```sql
CREATE TABLE ai_insights_perplexity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  prompt text,
  category text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  workflow_status text DEFAULT 'pending' CHECK (workflow_status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  ai_model text,
  tags text[] DEFAULT '{}',
  related_insights uuid[] DEFAULT '{}',
  pdf_content bytea,
  pdf_filename text,
  pdf_size integer,
  pdf_mime_type text,
  pdf_created_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `ai_insights_summary`
```sql
CREATE TABLE ai_insights_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  total_insights integer DEFAULT 0,
  insights_by_category jsonb DEFAULT '{}',
  insights_by_priority jsonb DEFAULT '{}',
  insights_by_status jsonb DEFAULT '{}',
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

### Workflow Configuration
```typescript
interface AIInsightsWorkflowConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  perplexityApiKey?: string;
  defaultUserId?: string;
  enablePDFProcessing?: boolean;
  maxFileSize?: number;
  supportedFormats?: string[];
}
```

### Default Configuration
```typescript
const defaultConfig = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  perplexityApiKey: process.env.PERPLEXITY_API_KEY,
  defaultUserId: 'demo-user',
  enablePDFProcessing: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['application/pdf', 'text/plain']
};
```

## 🚀 Implementation

### 1. Initialize Workflow
```typescript
import { AIInsightsWorkflow } from './ai-insights-workflow';

const workflow = new AIInsightsWorkflow({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  perplexityApiKey: process.env.PERPLEXITY_API_KEY,
  defaultUserId: 'demo-user',
  enablePDFProcessing: true
});
```

### 2. Create AI Insight
```typescript
const insight = await workflow.createInsight({
  title: 'Performance Optimization Analysis',
  description: 'Analysis of application performance bottlenecks',
  content: 'Detailed analysis content...',
  category: 'performance',
  priority: 'high',
  tags: ['optimization', 'performance', 'analysis']
});
```

### 3. Process PDF Content
```typescript
const pdfBuffer = fs.readFileSync('document.pdf');
const insight = await workflow.createInsightWithPDF({
  title: 'Technical Documentation Analysis',
  description: 'Analysis of technical documentation',
  content: 'Analysis based on PDF content...',
  category: 'documentation',
  priority: 'medium'
}, pdfBuffer, 'document.pdf');
```

## 📊 Workflow Steps

### 1. **Insight Creation**
- **Purpose**: Create new AI insights with metadata
- **Features**:
  - Title and description validation
  - Category assignment
  - Priority setting
  - Tag management
  - Content validation
- **Duration**: ~1-2 seconds
- **Output**: Created insight with unique ID

### 2. **PDF Processing** (Optional)
- **Purpose**: Extract and process PDF content
- **Features**:
  - PDF content extraction
  - Text analysis and processing
  - Metadata extraction
  - File validation
  - Content integration
- **Duration**: ~2-5 seconds
- **Output**: Processed PDF content integrated with insight

### 3. **Content Analysis**
- **Purpose**: Analyze insight content and generate summaries
- **Features**:
  - Content summarization
  - Keyword extraction
  - Sentiment analysis
  - Category suggestion
  - Related content identification
- **Duration**: ~3-7 seconds
- **Output**: Enhanced insight with analysis results

### 4. **Perplexity.ai Integration** (Optional)
- **Purpose**: Enhanced AI analysis using Perplexity.ai
- **Features**:
  - Advanced content analysis
  - Research enhancement
  - Fact verification
  - Context enrichment
  - Related information discovery
- **Duration**: ~5-15 seconds
- **Output**: Enhanced insight with Perplexity.ai analysis

### 5. **Database Storage**
- **Purpose**: Store insight in database with proper indexing
- **Features**:
  - Database insertion
  - Index creation
  - Relationship management
  - Search vector generation
  - Summary updates
- **Duration**: ~1-3 seconds
- **Output**: Stored insight with search capabilities

## 🔄 API Operations

### Create Insight
```typescript
interface CreateInsightRequest {
  title: string;
  description?: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  related_insights?: string[];
  ai_model?: string;
}
```

### Search Insights
```typescript
interface SearchInsightsRequest {
  query: string;
  category?: string;
  priority?: string;
  status?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}
```

### Update Insight
```typescript
interface UpdateInsightRequest {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  priority?: string;
  status?: string;
  tags?: string[];
}
```

## 📈 Insight Categories

### Available Categories
- **Performance**: Performance optimization and analysis
- **Security**: Security assessments and recommendations
- **Architecture**: System architecture and design
- **User Experience**: UX/UI improvements and analysis
- **Code Quality**: Code quality and best practices
- **Testing**: Testing strategies and improvements
- **Documentation**: Documentation and knowledge management
- **Deployment**: Deployment and DevOps insights
- **Monitoring**: Monitoring and observability
- **AI Integration**: AI and machine learning insights

### Priority Levels
- **Critical**: Immediate attention required
- **High**: Important, should be addressed soon
- **Medium**: Moderate importance
- **Low**: Nice to have, low priority

## 🛠️ Utility Functions

### Insight Management
```typescript
// Create insight
const insight = await workflow.createInsight(request);

// Get insight by ID
const insight = await workflow.getInsight(insightId);

// Update insight
const updated = await workflow.updateInsight(insightId, updates);

// Delete insight
await workflow.deleteInsight(insightId);

// Get insights by category
const insights = await workflow.getInsightsByCategory('performance');

// Search insights
const results = await workflow.searchInsights('optimization');
```

### PDF Processing
```typescript
// Create insight with PDF
const insight = await workflow.createInsightWithPDF(request, pdfBuffer, filename);

// Extract PDF content
const content = await workflow.extractPDFContent(pdfBuffer);

// Validate PDF file
const isValid = await workflow.validatePDFFile(pdfBuffer, filename);
```

### Analytics
```typescript
// Get insights summary
const summary = await workflow.getInsightsSummary();

// Get insights by priority
const insights = await workflow.getInsightsByPriority('high');

// Get insights by status
const insights = await workflow.getInsightsByStatus('pending');
```

## 🔍 Search Functionality

### Full-Text Search
- **Content Search**: Search through insight content
- **Title Search**: Search insight titles
- **Description Search**: Search insight descriptions
- **Tag Search**: Search by tags
- **Category Search**: Filter by categories

### Advanced Search
- **Boolean Queries**: AND, OR, NOT operations
- **Phrase Search**: Exact phrase matching
- **Wildcard Search**: Pattern matching
- **Fuzzy Search**: Approximate matching
- **Faceted Search**: Multiple filter combinations

### Search Results
```typescript
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  tags: string[];
  relevance_score: number;
  created_at: string;
  updated_at: string;
}
```

## 🔍 Error Handling

### Common Errors
- **Validation Errors**: Invalid input data
- **File Errors**: PDF processing failures
- **Database Errors**: Storage and retrieval issues
- **API Errors**: Perplexity.ai integration failures
- **Permission Errors**: Access control issues

### Error Recovery
- **Input Validation**: Comprehensive input validation
- **File Validation**: PDF file format and size validation
- **Retry Logic**: Automatic retry for transient failures
- **Fallback Options**: Alternative processing methods
- **Error Logging**: Detailed error logging and reporting

## 📊 Performance Considerations

### Optimization Strategies
- **Batch Processing**: Process multiple insights together
- **Caching**: Cache frequently accessed insights
- **Indexing**: Optimize database indexes for search
- **Pagination**: Implement efficient pagination
- **Lazy Loading**: Load content on demand

### Monitoring
- **Response Times**: Track API response times
- **Search Performance**: Monitor search query performance
- **File Processing**: Track PDF processing times
- **Database Performance**: Monitor database operations
- **Memory Usage**: Track memory consumption

## 🔐 Security

### Data Protection
- **Input Sanitization**: Sanitize all user inputs
- **File Validation**: Validate uploaded files
- **Access Control**: User-based access control
- **Data Encryption**: Encrypt sensitive data
- **Audit Logging**: Log all operations

### Privacy
- **User Data Isolation**: Isolate user data
- **Content Filtering**: Filter sensitive content
- **Access Logging**: Log data access
- **Data Retention**: Manage data retention policies
- **GDPR Compliance**: Ensure GDPR compliance

## 🧪 Testing

### Test Scenarios
- **Insight Creation**: Test insight creation with various inputs
- **PDF Processing**: Test PDF file processing
- **Search Functionality**: Test search capabilities
- **Error Handling**: Test error conditions
- **Performance**: Test under load

### Test Data
- **Sample Insights**: Test insights with various categories
- **Test PDFs**: Sample PDF files for testing
- **Mock Data**: Mock data for testing
- **Performance Data**: Performance test data

## 📚 Examples

### Basic Usage
```typescript
// Initialize workflow
const workflow = new AIInsightsWorkflow({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  defaultUserId: 'user123'
});

// Create insight
const insight = await workflow.createInsight({
  title: 'Performance Analysis',
  description: 'Analysis of application performance',
  content: 'Detailed performance analysis...',
  category: 'performance',
  priority: 'high',
  tags: ['optimization', 'performance']
});
```

### PDF Processing
```typescript
// Read PDF file
const pdfBuffer = fs.readFileSync('analysis.pdf');

// Create insight with PDF
const insight = await workflow.createInsightWithPDF({
  title: 'Technical Analysis',
  description: 'Analysis from PDF document',
  content: 'Analysis summary...',
  category: 'documentation',
  priority: 'medium'
}, pdfBuffer, 'analysis.pdf');
```

### Search and Filter
```typescript
// Search insights
const results = await workflow.searchInsights('performance optimization');

// Filter by category
const performanceInsights = await workflow.getInsightsByCategory('performance');

// Filter by priority
const highPriorityInsights = await workflow.getInsightsByPriority('high');
```

### Analytics
```typescript
// Get insights summary
const summary = await workflow.getInsightsSummary();
console.log(`Total insights: ${summary.total_insights}`);
console.log(`By category:`, summary.insights_by_category);
console.log(`By priority:`, summary.insights_by_priority);
```

## 🔗 Related Workflows

- **AI Documentation Workflow**: Integrates with documentation insights
- **AI Audit Suggestions Workflow**: Provides audit insights
- **Build Logs Workflow**: Logs insight creation events
- **Pre-Commit Workflow**: Uses insights for code analysis

## 📋 Checklist

### Before Implementation
- [ ] Set up Supabase database with ai_insights_perplexity table
- [ ] Configure Perplexity.ai API key
- [ ] Set up file upload handling
- [ ] Configure search indexes
- [ ] Set up monitoring and logging

### During Implementation
- [ ] Implement insight CRUD operations
- [ ] Add PDF processing capabilities
- [ ] Implement search functionality
- [ ] Add error handling
- [ ] Set up analytics

### After Implementation
- [ ] Test insight creation and management
- [ ] Validate PDF processing
- [ ] Test search functionality
- [ ] Monitor performance
- [ ] Gather user feedback

---

*This workflow is part of the MyMindVentures.io workflow collection. For more information, see the main [README](./README.md).*
