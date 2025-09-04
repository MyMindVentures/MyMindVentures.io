import { Pinecone } from '@pinecone-database/pinecone';

// Pinecone configuration
const PINECONE_API_KEY =
  process.env.REACT_APP_PINECONE_API_KEY || 'your-pinecone-api-key';
const PINECONE_ENVIRONMENT =
  process.env.REACT_APP_PINECONE_ENVIRONMENT || 'gcp-starter';
const PINECONE_INDEX_NAME =
  process.env.REACT_APP_PINECONE_INDEX_NAME || 'mymindventures-docs';

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT,
});

// Document types for different content
export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    title: string;
    type:
      | 'codebase-analysis'
      | 'documentation'
      | 'feature-spec'
      | 'user-guide'
      | 'api-docs'
      | 'workflow'
      | 'ai-insights';
    category: string;
    tags: string[];
    source: string;
    timestamp: string;
    version: string;
    relevance_score?: number;
    ai_model?: string;
    file_path?: string;
    line_numbers?: string;
    complexity?: 'low' | 'medium' | 'high';
    priority?: 'low' | 'medium' | 'high' | 'critical';
  };
  embedding?: number[];
}

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  metadata: DocumentChunk['metadata'];
}

export interface ChatContext {
  query: string;
  relevantDocs: SearchResult[];
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  currentFocus: string;
  suggestedActions: string[];
}

class PineconeService {
  private index: any;

  constructor() {
    this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      this.index = pinecone.index(PINECONE_INDEX_NAME);
      console.log('Pinecone index initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Pinecone index:', error);
    }
  }

  // Store document chunks in Pinecone
  async storeDocumentChunks(chunks: DocumentChunk[]) {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      const vectors = chunks.map(chunk => ({
        id: chunk.id,
        values: chunk.embedding || this.generateSimpleEmbedding(chunk.content),
        metadata: chunk.metadata,
      }));

      const result = await this.index.upsert(vectors);
      console.log(`Stored ${chunks.length} document chunks in Pinecone`);
      return result;
    } catch (error) {
      console.error('Error storing document chunks:', error);
      throw error;
    }
  }

  // Search for relevant documents
  async searchDocuments(
    query: string,
    filters?: {
      type?: string;
      category?: string;
      tags?: string[];
      limit?: number;
    }
  ): Promise<SearchResult[]> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      // Generate query embedding (simplified for now)
      const queryEmbedding = this.generateSimpleEmbedding(query);

      const searchOptions: any = {
        vector: queryEmbedding,
        topK: filters?.limit || 10,
        includeMetadata: true,
        includeValues: false,
      };

      // Add filters if provided
      if (filters?.type) {
        searchOptions.filter = { type: { $eq: filters.type } };
      }
      if (filters?.category) {
        searchOptions.filter = { category: { $eq: filters.category } };
      }
      if (filters?.tags && filters.tags.length > 0) {
        searchOptions.filter = { tags: { $in: filters.tags } };
      }

      const searchResponse = await this.index.query(searchOptions);

      return (
        searchResponse.matches?.map(match => ({
          id: match.id,
          score: match.score || 0,
          content: match.metadata?.content || '',
          metadata: match.metadata || {},
        })) || []
      );
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  // Clear old documentation by type before storing new
  async clearOldDocumentationByType(type: string) {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      // Query for documents of the specific type
      const queryResponse = await this.index.query({
        vector: this.generateSimpleEmbedding(type), // Simple query vector
        topK: 1000, // Get all documents of this type
        includeMetadata: true,
        filter: { type: { $eq: type } },
      });

      if (queryResponse.matches && queryResponse.matches.length > 0) {
        // Delete all documents of this type
        const idsToDelete = queryResponse.matches.map(match => match.id);
        await this.index.deleteMany(idsToDelete);
        console.log(
          `🗑️ Cleared ${idsToDelete.length} old ${type} documents from Pinecone`
        );
        return idsToDelete.length;
      }

      console.log(`ℹ️ No old ${type} documents found to clear`);
      return 0;
    } catch (error) {
      console.error(`Error clearing old ${type} documentation:`, error);
      return 0;
    }
  }

  // Store full documentation and replace old
  async storeFullDocumentationAndReplace(
    documentation: DocumentChunk[],
    type: string
  ) {
    try {
      // First, clear old documentation of this type
      const clearedCount = await this.clearOldDocumentationByType(type);

      // Then store new documentation
      const result = await this.storeDocumentChunks(documentation);

      console.log(
        `✅ Replaced ${clearedCount} old ${type} documents with ${documentation.length} new ones`
      );

      return {
        success: true,
        oldDocumentsCleared: clearedCount,
        newDocumentsStored: documentation.length,
        type: type,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        'Error storing full documentation and replacing old:',
        error
      );
      throw error;
    }
  }

  // Store AI Codebase Analysis results and replace old
  async storeAICodebaseAnalysisAndReplace(analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    codeQuality: any;
    performanceMetrics: any;
    securityFindings: any;
    timestamp: string;
    aiModel: string;
  }) {
    const chunks: DocumentChunk[] = [
      {
        id: `analysis-summary-${Date.now()}`,
        content: analysis.summary,
        metadata: {
          title: 'AI Codebase Analysis Summary',
          type: 'codebase-analysis',
          category: 'analysis',
          tags: ['ai-analysis', 'codebase', 'summary'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      },
      ...analysis.insights.map((insight, index) => ({
        id: `analysis-insight-${Date.now()}-${index}`,
        content: insight,
        metadata: {
          title: `AI Insight ${index + 1}`,
          type: 'codebase-analysis',
          category: 'insights',
          tags: ['ai-analysis', 'insight', 'codebase'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      })),
      ...analysis.recommendations.map((rec, index) => ({
        id: `analysis-recommendation-${Date.now()}-${index}`,
        content: rec,
        metadata: {
          title: `AI Recommendation ${index + 1}`,
          type: 'codebase-analysis',
          category: 'recommendations',
          tags: ['ai-analysis', 'recommendation', 'codebase'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      })),
    ];

    // Store and replace old analysis
    return this.storeFullDocumentationAndReplace(chunks, 'codebase-analysis');
  }

  // Store comprehensive documentation and replace old
  async storeComprehensiveDocumentationAndReplace(
    docs: Array<{
      title: string;
      content: string;
      type: string;
      category: string;
      tags: string[];
      source: string;
      version: string;
      ai_model?: string;
      file_path?: string;
      line_numbers?: string;
      complexity?: 'low' | 'medium' | 'high';
      priority?: 'low' | 'medium' | 'high' | 'critical';
    }>
  ) {
    const chunks: DocumentChunk[] = docs.map((doc, index) => ({
      id: `doc-${Date.now()}-${index}`,
      content: doc.content,
      metadata: {
        title: doc.title,
        type: doc.type as any,
        category: doc.category,
        tags: doc.tags,
        source: doc.source,
        timestamp: new Date().toISOString(),
        version: doc.version,
        ai_model: doc.ai_model,
        file_path: doc.file_path,
        line_numbers: doc.line_numbers,
        complexity: doc.complexity,
        priority: doc.priority,
      },
    }));

    // Group by type and replace each type
    const groupedByType = chunks.reduce(
      (acc, chunk) => {
        const type = chunk.metadata.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(chunk);
        return acc;
      },
      {} as Record<string, DocumentChunk[]>
    );

    const results = [];
    for (const [type, typeChunks] of Object.entries(groupedByType)) {
      const result = await this.storeFullDocumentationAndReplace(
        typeChunks,
        type
      );
      results.push(result);
    }

    return {
      success: true,
      results: results,
      totalDocumentsStored: chunks.length,
      timestamp: new Date().toISOString(),
    };
  }

  // Store AI Codebase Analysis results (legacy function)
  async storeAICodebaseAnalysis(analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    codeQuality: any;
    performanceMetrics: any;
    securityFindings: any;
    timestamp: string;
    aiModel: string;
  }) {
    const chunks: DocumentChunk[] = [
      {
        id: `analysis-summary-${Date.now()}`,
        content: analysis.summary,
        metadata: {
          title: 'AI Codebase Analysis Summary',
          type: 'codebase-analysis',
          category: 'analysis',
          tags: ['ai-analysis', 'codebase', 'summary'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      },
      ...analysis.insights.map((insight, index) => ({
        id: `analysis-insight-${Date.now()}-${index}`,
        content: insight,
        metadata: {
          title: `AI Insight ${index + 1}`,
          type: 'codebase-analysis',
          category: 'insights',
          tags: ['ai-analysis', 'insight', 'codebase'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      })),
      ...analysis.recommendations.map((rec, index) => ({
        id: `analysis-recommendation-${Date.now()}-${index}`,
        content: rec,
        metadata: {
          title: `AI Recommendation ${index + 1}`,
          type: 'codebase-analysis',
          category: 'recommendations',
          tags: ['ai-analysis', 'recommendation', 'codebase'],
          source: 'ai-model',
          timestamp: analysis.timestamp,
          version: '1.0',
          ai_model: analysis.aiModel,
        },
      })),
    ];

    return this.storeDocumentChunks(chunks);
  }

  // Store documentation (legacy function)
  async storeDocumentation(
    docs: Array<{
      title: string;
      content: string;
      type: string;
      category: string;
      tags: string[];
      source: string;
      version: string;
    }>
  ) {
    const chunks: DocumentChunk[] = docs.map((doc, index) => ({
      id: `doc-${Date.now()}-${index}`,
      content: doc.content,
      metadata: {
        title: doc.title,
        type: doc.type as any,
        category: doc.category,
        tags: doc.tags,
        source: doc.source,
        timestamp: new Date().toISOString(),
        version: doc.version,
      },
    }));

    return this.storeDocumentChunks(chunks);
  }

  // Store feature specifications
  async storeFeatureSpecs(
    features: Array<{
      title: string;
      description: string;
      requirements: string[];
      userStories: string[];
      technicalDetails: string;
      priority: string;
      complexity: string;
      category: string;
    }>
  ) {
    const chunks: DocumentChunk[] = features.map((feature, index) => ({
      id: `feature-${Date.now()}-${index}`,
      content: `${feature.description}\n\nRequirements: ${feature.requirements.join(', ')}\n\nUser Stories: ${feature.userStories.join(', ')}\n\nTechnical Details: ${feature.technicalDetails}`,
      metadata: {
        title: feature.title,
        type: 'feature-spec',
        category: feature.category,
        tags: [
          'feature',
          'specification',
          feature.priority,
          feature.complexity,
        ],
        source: 'product-team',
        timestamp: new Date().toISOString(),
        version: '1.0',
        priority: feature.priority as any,
        complexity: feature.complexity as any,
      },
    }));

    return this.storeDocumentChunks(chunks);
  }

  // Get conversation context for AI chatbot
  async getChatContext(
    query: string,
    conversationHistory: Array<{ role: string; content: string }>
  ) {
    // Search for relevant documents
    const relevantDocs = await this.searchDocuments(query, { limit: 5 });

    // Analyze conversation history to determine current focus
    const currentFocus = this.analyzeConversationFocus(conversationHistory);

    // Generate suggested actions based on query and context
    const suggestedActions = this.generateSuggestedActions(
      query,
      relevantDocs,
      currentFocus
    );

    return {
      query,
      relevantDocs,
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date().toISOString(),
      })),
      currentFocus,
      suggestedActions,
    };
  }

  // Analyze conversation focus
  private analyzeConversationFocus(
    history: Array<{ role: string; content: string }>
  ) {
    if (history.length === 0) return 'general';

    const recentMessages = history.slice(-3); // Last 3 messages
    const content = recentMessages
      .map(msg => msg.content)
      .join(' ')
      .toLowerCase();

    if (
      content.includes('feature') ||
      content.includes('new') ||
      content.includes('add')
    ) {
      return 'feature-development';
    } else if (
      content.includes('bug') ||
      content.includes('fix') ||
      content.includes('error')
    ) {
      return 'bug-fixing';
    } else if (
      content.includes('performance') ||
      content.includes('optimize') ||
      content.includes('speed')
    ) {
      return 'performance-optimization';
    } else if (
      content.includes('documentation') ||
      content.includes('guide') ||
      content.includes('help')
    ) {
      return 'documentation';
    } else if (
      content.includes('brainstorm') ||
      content.includes('idea') ||
      content.includes('suggestion')
    ) {
      return 'brainstorming';
    }

    return 'general';
  }

  // Generate suggested actions
  private generateSuggestedActions(
    query: string,
    relevantDocs: SearchResult[],
    focus: string
  ) {
    const actions: string[] = [];

    if (focus === 'feature-development') {
      actions.push(
        'Create feature specification',
        'Define user stories',
        'Estimate development effort'
      );
    } else if (focus === 'bug-fixing') {
      actions.push(
        'Create bug report',
        'Investigate root cause',
        'Plan fix implementation'
      );
    } else if (focus === 'performance-optimization') {
      actions.push(
        'Run performance analysis',
        'Identify bottlenecks',
        'Create optimization plan'
      );
    } else if (focus === 'documentation') {
      actions.push(
        'Update documentation',
        'Create user guide',
        'Add code examples'
      );
    } else if (focus === 'brainstorming') {
      actions.push(
        'Explore similar features',
        'Research best practices',
        'Create concept mockup'
      );
    }

    // Add general actions
    actions.push(
      'Search for more information',
      'Ask clarifying questions',
      'Create action item'
    );

    return actions;
  }

  // Simple embedding generation (placeholder - in production, use proper embedding model)
  private generateSimpleEmbedding(text: string): number[] {
    // This is a simplified placeholder. In production, use OpenAI embeddings or similar
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(1536).fill(0); // OpenAI embedding size

    words.forEach((word, index) => {
      if (index < embedding.length) {
        embedding[index] = word.length / 10; // Simple hash-like value
      }
    });

    return embedding;
  }

  // Get document statistics
  async getDocumentStats() {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      const stats = await this.index.describeIndexStats();
      return {
        totalVectors: stats.totalVectorCount || 0,
        dimension: stats.dimension || 0,
        indexFullness: stats.indexFullness || 0,
        namespaces: stats.namespaces || {},
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return null;
    }
  }

  // Clear all documents (for testing/reset)
  async clearAllDocuments() {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      await this.index.deleteAll();
      console.log('All documents cleared from Pinecone');
    } catch (error) {
      console.error('Error clearing documents:', error);
      throw error;
    }
  }
}

export const pineconeService = new PineconeService();
export default pineconeService;
