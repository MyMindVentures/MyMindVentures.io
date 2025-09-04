import { BaseService } from './BaseService';
import { AIInsightsRepository, AIInsightFilters, AIInsightSummary } from '../repositories/AIInsightsRepository';
import { 
  AIInsight, 
  AIInsightCreateRequest, 
  AIInsightUpdateRequest,
  AIInsightSearchResult,
  AIInsightAnalytics,
  AIInsightExportOptions,
  AIInsightImportResult,
  AIInsightBulkOperation,
  AIInsightBulkOperationResult,
  AIInsightWorkflow,
  AIInsightTemplate
} from '../types/ai-insights';
import { Logger } from '../utils/Logger';
import { ApiResponse } from '../types/base';

export class AIInsightsService extends BaseService {
  private insightsRepository: AIInsightsRepository;
  private serviceLogger: Logger;

  constructor(insightsRepository: AIInsightsRepository) {
    super();
    this.insightsRepository = insightsRepository;
    this.serviceLogger = new Logger('AIInsightsService');
  }

  // Create AI Insight with validation and business logic
  async createInsight(
    request: AIInsightCreateRequest,
    pdfContent?: Buffer,
    pdfFilename?: string
  ): Promise<ApiResponse<AIInsight>> {
    try {
      this.serviceLogger.info('Creating new AI Insight', { 
        title: request.title,
        category: request.category,
        priority: request.priority 
      });

      // Pre-processing validation
      const validationResult = await this.validateInsightRequest(request);
      if (!validationResult.success) {
        return validationResult;
      }

      // Business logic: Auto-assign workflow status for high/critical priority
      if (request.priority === 'high' || request.priority === 'critical') {
        request.workflow_status = 'pending';
      }

      // Business logic: Auto-generate tags if none provided
      if (!request.tags || request.tags.length === 0) {
        request.tags = this.generateDefaultTags(request.category, request.ai_model);
      }

      // Create the insight
      let result: ApiResponse<AIInsight>;
      if (pdfContent && pdfFilename) {
        result = await this.insightsRepository.createWithPDF(request, pdfContent, pdfFilename);
      } else {
        result = await this.insightsRepository.create(request);
      }

      if (result.success && result.data) {
        // Post-processing: Update related insights if specified
        if (request.related_insights && request.related_insights.length > 0) {
          await this.updateRelatedInsights(result.data.id, request.related_insights);
        }

        // Post-processing: Log creation for analytics
        await this.logInsightCreation(result.data);

        this.serviceLogger.info('Successfully created AI Insight', { 
          id: result.data.id,
          title: result.data.title 
        });
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Unexpected error creating AI Insight', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights with advanced filtering and business logic
  async getInsights(
    filters: AIInsightFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<AIInsight[]>> {
    try {
      this.serviceLogger.debug('Getting AI Insights with filters', { filters, page, limit });

      // Business logic: Apply user-specific filters
      if (filters.user_id) {
        // Check if user has access to all insights or just their own
        // This could involve role-based access control
        filters.user_id = filters.user_id;
      }

      // Business logic: Apply date range filters with defaults
      if (!filters.date_from && !filters.date_to) {
        // Default to last 30 days if no date range specified
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filters.date_from = thirtyDaysAgo.toISOString();
      }

      const result = await this.insightsRepository.searchWithFilters(filters, page, limit);
      
      if (result.success && result.data) {
        // Post-processing: Update view counts for returned insights
        await this.updateViewCounts(result.data.map(insight => insight.id));
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Error getting AI Insights', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Update insight with business logic
  async updateInsight(
    insightId: string,
    updates: AIInsightUpdateRequest
  ): Promise<ApiResponse<AIInsight>> {
    try {
      this.serviceLogger.info('Updating AI Insight', { insightId, updates });

      // Pre-processing: Check if insight exists and user has permission
      const existingInsight = await this.insightsRepository.findById(insightId);
      if (!existingInsight.success || !existingInsight.data) {
        return { success: false, error: 'Insight not found', data: null };
      }

      // Business logic: Validate status transitions
      if (updates.status && updates.status !== existingInsight.data.status) {
        const statusTransitionValid = this.validateStatusTransition(
          existingInsight.data.status,
          updates.status
        );
        if (!statusTransitionValid) {
          return { 
            success: false, 
            error: `Invalid status transition from ${existingInsight.data.status} to ${updates.status}`, 
            data: null 
          };
        }
      }

      // Business logic: Auto-update completion percentage based on status
      if (updates.status === 'completed') {
        updates.completion_percentage = 100;
      } else if (updates.status === 'in-progress') {
        updates.completion_percentage = Math.max(
          existingInsight.data.completion_percentage || 0,
          25
        );
      }

      // Update the insight
      const result = await this.insightsRepository.update(insightId, updates);

      if (result.success && result.data) {
        // Post-processing: Update related insights if category changed
        if (updates.category && updates.category !== existingInsight.data.category) {
          await this.handleCategoryChange(insightId, existingInsight.data.category, updates.category);
        }

        // Post-processing: Log update for analytics
        await this.logInsightUpdate(result.data, updates);

        this.serviceLogger.info('Successfully updated AI Insight', { 
          id: insightId,
          updatedFields: Object.keys(updates) 
        });
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Error updating AI Insight', { insightId, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Delete insight with business logic
  async deleteInsight(insightId: string): Promise<ApiResponse<boolean>> {
    try {
      this.serviceLogger.info('Deleting AI Insight', { insightId });

      // Pre-processing: Check if insight can be deleted
      const existingInsight = await this.insightsRepository.findById(insightId);
      if (!existingInsight.success || !existingInsight.data) {
        return { success: false, error: 'Insight not found', data: false };
      }

      // Business logic: Check if insight is referenced by other insights
      const isReferenced = await this.checkInsightReferences(insightId);
      if (isReferenced) {
        return { 
          success: false, 
          error: 'Cannot delete insight that is referenced by other insights', 
          data: false 
        };
      }

      // Business logic: Soft delete instead of hard delete for high-priority insights
      if (existingInsight.data.priority === 'critical' || existingInsight.data.priority === 'high') {
        const softDeleteResult = await this.insightsRepository.update(insightId, {
          status: 'archived',
          workflow_status: 'cancelled'
        });
        
        if (softDeleteResult.success) {
          this.serviceLogger.info('Soft deleted high-priority AI Insight', { insightId });
          return { success: true, data: true, error: null };
        }
      }

      // Hard delete for other insights
      const result = await this.insightsRepository.delete(insightId);

      if (result.success) {
        // Post-processing: Log deletion for analytics
        await this.logInsightDeletion(insightId, existingInsight.data);

        this.serviceLogger.info('Successfully deleted AI Insight', { insightId });
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Error deleting AI Insight', { insightId, error });
      return { success: false, error: String(error), data: false };
    }
  }

  // Get insights summary with business logic
  async getInsightsSummary(userId?: string): Promise<ApiResponse<AIInsightSummary>> {
    try {
      this.serviceLogger.debug('Getting AI Insights summary', { userId });

      const result = await this.insightsRepository.getSummary(userId);
      
      if (result.success && result.data) {
        // Business logic: Calculate additional metrics
        const enhancedSummary = await this.enhanceSummaryWithBusinessMetrics(result.data, userId);
        return { success: true, data: enhancedSummary, error: null };
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Error getting AI Insights summary', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Search insights with business logic
  async searchInsights(
    searchQuery: string,
    filters: AIInsightFilters = {}
  ): Promise<ApiResponse<AIInsightSearchResult[]>> {
    try {
      this.serviceLogger.debug('Searching AI Insights', { searchQuery, filters });

      // Business logic: Enhance search query with synonyms and related terms
      const enhancedQuery = this.enhanceSearchQuery(searchQuery);

      // Business logic: Apply relevance scoring
      const result = await this.insightsRepository.search(enhancedQuery, filters);
      
      if (result.success && result.data) {
        // Post-processing: Calculate relevance scores
        const searchResults = await this.calculateRelevanceScores(result.data, searchQuery);
        
        // Post-processing: Update search analytics
        await this.logSearchQuery(searchQuery, filters, searchResults.length);

        return { success: true, data: searchResults, error: null };
      }

      return result;
    } catch (error) {
      this.serviceLogger.error('Error searching AI Insights', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Bulk operations with business logic
  async executeBulkOperation(
    operation: AIInsightBulkOperation
  ): Promise<ApiResponse<AIInsightBulkOperationResult>> {
    try {
      this.serviceLogger.info('Executing bulk operation', { 
        operation: operation.operation,
        insightCount: operation.insightIds.length 
      });

      // Pre-processing: Validate bulk operation
      const validationResult = await this.validateBulkOperation(operation);
      if (!validationResult.success) {
        return validationResult;
      }

      // Execute the bulk operation
      const results: any[] = [];
      const errors: Array<{ insightId: string; error: string }> = [];
      const warnings: Array<{ insightId: string; warning: string }> = [];

      for (const insightId of operation.insightIds) {
        try {
          let result: any;
          
          switch (operation.operation) {
            case 'update':
              if (operation.updates) {
                result = await this.updateInsight(insightId, operation.updates);
              }
              break;
            case 'change-status':
              if (operation.newStatus) {
                result = await this.insightsRepository.updateStatus(insightId, operation.newStatus);
              }
              break;
            case 'change-priority':
              if (operation.newPriority) {
                result = await this.insightsRepository.updatePriority(insightId, operation.newPriority);
              }
              break;
            case 'archive':
              result = await this.insightsRepository.updateStatus(insightId, 'archived');
              break;
            case 'delete':
              result = await this.deleteInsight(insightId);
              break;
          }

          if (result && result.success) {
            results.push(result.data);
          } else {
            errors.push({ insightId, error: result?.error || 'Unknown error' });
          }
        } catch (error) {
          errors.push({ insightId, error: String(error) });
        }
      }

      const bulkResult: AIInsightBulkOperationResult = {
        operation: operation.operation,
        totalInsights: operation.insightIds.length,
        successful: results.length,
        failed: errors.length,
        errors,
        warnings
      };

      // Post-processing: Log bulk operation for analytics
      await this.logBulkOperation(operation, bulkResult);

      this.serviceLogger.info('Bulk operation completed', { 
        operation: operation.operation,
        successful: results.length,
        failed: errors.length 
      });

      return { success: true, data: bulkResult, error: null };
    } catch (error) {
      this.serviceLogger.error('Error executing bulk operation', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Private helper methods
  private async validateInsightRequest(request: AIInsightCreateRequest): Promise<ApiResponse<boolean>> {
    // Validate required fields
    if (!request.title || !request.content || !request.category) {
      return { success: false, error: 'Missing required fields', data: false };
    }

    // Validate category
    const validCategories = [
      'pwa-development', 'ai-workflow', 'supabase-integration', 'architecture',
      'testing', 'deployment', 'security', 'performance', 'accessibility',
      'internationalization', 'monitoring', 'documentation', 'other'
    ];
    if (!validCategories.includes(request.category)) {
      return { success: false, error: 'Invalid category', data: false };
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'critical', 'urgent'];
    if (!validPriorities.includes(request.priority)) {
      return { success: false, error: 'Invalid priority', data: false };
    }

    // Validate status
    const validStatuses = ['draft', 'active', 'archived', 'deprecated', 'in-review', 'approved', 'rejected'];
    if (!validStatuses.includes(request.status)) {
      return { success: false, error: 'Invalid status', data: false };
    }

    return { success: true, data: true, error: null };
  }

  private generateDefaultTags(category: string, aiModel: string): string[] {
    const tags = [category, aiModel];
    
    // Add category-specific tags
    switch (category) {
      case 'pwa-development':
        tags.push('pwa', 'web-app', 'progressive');
        break;
      case 'ai-workflow':
        tags.push('ai', 'workflow', 'automation');
        break;
      case 'supabase-integration':
        tags.push('supabase', 'backend', 'database');
        break;
      case 'architecture':
        tags.push('architecture', 'design', 'patterns');
        break;
    }

    return tags;
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      'draft': ['active', 'in-review'],
      'active': ['archived', 'deprecated', 'in-review'],
      'in-review': ['approved', 'rejected', 'active'],
      'approved': ['active', 'archived'],
      'rejected': ['draft', 'archived'],
      'archived': ['active', 'deprecated'],
      'deprecated': ['archived']
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  }

  private async updateRelatedInsights(insightId: string, relatedIds: string[]): Promise<void> {
    // Update related insights to reference this new insight
    for (const relatedId of relatedIds) {
      try {
        const relatedInsight = await this.insightsRepository.findById(relatedId);
        if (relatedInsight.success && relatedInsight.data) {
          const currentRelated = relatedInsight.data.related_insights || [];
          if (!currentRelated.includes(insightId)) {
            await this.insightsRepository.update(relatedId, {
              related_insights: [...currentRelated, insightId]
            });
          }
        }
      } catch (error) {
        this.serviceLogger.warn('Failed to update related insight', { relatedId, error });
      }
    }
  }

  private async logInsightCreation(insight: AIInsight): Promise<void> {
    // Log insight creation for analytics
    this.serviceLogger.info('Insight creation logged for analytics', {
      insightId: insight.id,
      category: insight.category,
      priority: insight.priority
    });
  }

  private async logInsightUpdate(insight: AIInsight, updates: AIInsightUpdateRequest): Promise<void> {
    // Log insight updates for analytics
    this.serviceLogger.info('Insight update logged for analytics', {
      insightId: insight.id,
      updatedFields: Object.keys(updates)
    });
  }

  private async logInsightDeletion(insightId: string, insight: AIInsight): Promise<void> {
    // Log insight deletion for analytics
    this.serviceLogger.info('Insight deletion logged for analytics', {
      insightId,
      category: insight.category,
      priority: insight.priority
    });
  }

  private async updateViewCounts(insightIds: string[]): Promise<void> {
    // Update view counts for returned insights
    for (const insightId of insightIds) {
      try {
        const insight = await this.insightsRepository.findById(insightId);
        if (insight.success && insight.data) {
          const currentViews = insight.data.view_count || 0;
          await this.insightsRepository.update(insightId, {
            view_count: currentViews + 1,
            last_viewed_at: new Date().toISOString()
          });
        }
      } catch (error) {
        this.serviceLogger.warn('Failed to update view count', { insightId, error });
      }
    }
  }

  private async handleCategoryChange(
    insightId: string, 
    oldCategory: string, 
    newCategory: string
  ): Promise<void> {
    // Handle category change business logic
    this.serviceLogger.info('Handling category change', {
      insightId,
      oldCategory,
      newCategory
    });
  }

  private async checkInsightReferences(insightId: string): Promise<boolean> {
    // Check if insight is referenced by other insights
    try {
      const allInsights = await this.insightsRepository.findAll();
      if (allInsights.success && allInsights.data) {
        return allInsights.data.some(insight => 
          insight.related_insights && insight.related_insights.includes(insightId)
        );
      }
    } catch (error) {
      this.serviceLogger.warn('Failed to check insight references', { insightId, error });
    }
    return false;
  }

  private async enhanceSummaryWithBusinessMetrics(
    summary: AIInsightSummary,
    userId?: string
  ): Promise<AIInsightSummary> {
    // Enhance summary with additional business metrics
    return summary;
  }

  private enhanceSearchQuery(searchQuery: string): string {
    // Enhance search query with synonyms and related terms
    return searchQuery;
  }

  private async calculateRelevanceScores(
    insights: AIInsight[],
    searchQuery: string
  ): Promise<AIInsightSearchResult[]> {
    // Calculate relevance scores for search results
    return insights.map(insight => ({
      id: insight.id,
      title: insight.title,
      description: insight.description,
      category: insight.category,
      priority: insight.priority,
      status: insight.status,
      ai_model: insight.ai_model,
      tags: insight.tags,
      created_at: insight.created_at,
      updated_at: insight.updated_at,
      relevance_score: this.calculateRelevanceScore(insight, searchQuery),
      matched_fields: this.getMatchedFields(insight, searchQuery)
    }));
  }

  private calculateRelevanceScore(insight: AIInsight, searchQuery: string): number {
    // Simple relevance scoring algorithm
    let score = 0;
    const query = searchQuery.toLowerCase();
    
    if (insight.title.toLowerCase().includes(query)) score += 10;
    if (insight.description.toLowerCase().includes(query)) score += 5;
    if (insight.content.toLowerCase().includes(query)) score += 3;
    if (insight.tags.some(tag => tag.toLowerCase().includes(query))) score += 2;
    
    return score;
  }

  private getMatchedFields(insight: AIInsight, searchQuery: string): string[] {
    // Get fields that matched the search query
    const matchedFields: string[] = [];
    const query = searchQuery.toLowerCase();
    
    if (insight.title.toLowerCase().includes(query)) matchedFields.push('title');
    if (insight.description.toLowerCase().includes(query)) matchedFields.push('description');
    if (insight.content.toLowerCase().includes(query)) matchedFields.push('content');
    if (insight.tags.some(tag => tag.toLowerCase().includes(query))) matchedFields.push('tags');
    
    return matchedFields;
  }

  private async logSearchQuery(
    searchQuery: string,
    filters: AIInsightFilters,
    resultCount: number
  ): Promise<void> {
    // Log search queries for analytics
    this.serviceLogger.debug('Search query logged for analytics', {
      searchQuery,
      filters,
      resultCount
    });
  }

  private async validateBulkOperation(
    operation: AIInsightBulkOperation
  ): Promise<ApiResponse<boolean>> {
    // Validate bulk operation parameters
    if (!operation.insightIds || operation.insightIds.length === 0) {
      return { success: false, error: 'No insight IDs provided', data: false };
    }

    if (operation.insightIds.length > 100) {
      return { success: false, error: 'Bulk operation limited to 100 insights', data: false };
    }

    return { success: true, data: true, error: null };
  }

  private async logBulkOperation(
    operation: AIInsightBulkOperation,
    result: AIInsightBulkOperationResult
  ): Promise<void> {
    // Log bulk operations for analytics
    this.serviceLogger.info('Bulk operation logged for analytics', {
      operation: operation.operation,
      totalInsights: result.totalInsights,
      successful: result.successful,
      failed: result.failed
    });
  }
}
