import { SupabaseRepository, SupabaseConfig } from './SupabaseRepository';
import { AIInsight } from '../types/ai-insights';
import { Logger } from '../utils/Logger';

export interface AIInsightFilters {
  category?: string;
  status?: string;
  priority?: string;
  ai_model?: string;
  user_id?: string;
  search?: string;
}

export interface AIInsightSummary {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byModel: Record<string, number>;
}

export class AIInsightsRepository extends SupabaseRepository<AIInsight> {
  private insightsLogger: Logger;

  constructor(config: SupabaseConfig) {
    super(config, 'ai_insights_perplexity');
    this.insightsLogger = new Logger('AIInsightsRepository');
  }

  // Create AI Insight with PDF content
  async createWithPDF(
    insight: Omit<AIInsight, 'id' | 'created_at' | 'updated_at'>,
    pdfContent: Buffer,
    pdfFilename: string
  ) {
    try {
      this.insightsLogger.info('Creating AI Insight with PDF content', { 
        title: insight.title,
        pdfSize: pdfContent.length 
      });

      // First create the insight
      const createResult = await this.create(insight);
      if (!createResult.success || !createResult.data) {
        return createResult;
      }

      // Then update with PDF content
      const pdfData = {
        pdf_content: pdfContent,
        pdf_filename: pdfFilename,
        pdf_size: pdfContent.length,
        pdf_mime_type: 'application/pdf',
        pdf_created_at: new Date().toISOString()
      };

      const updateResult = await this.update(createResult.data.id, pdfData);
      if (!updateResult.success) {
        this.insightsLogger.error('Failed to update AI Insight with PDF content', {
          insightId: createResult.data.id,
          error: updateResult.error
        });
        // Note: The insight was created but PDF update failed
        return {
          success: false,
          error: `Insight created but PDF update failed: ${updateResult.error}`,
          data: createResult.data
        };
      }

      this.insightsLogger.info('Successfully created AI Insight with PDF content', {
        insightId: createResult.data.id,
        pdfFilename
      });

      return updateResult;
    } catch (error) {
      this.insightsLogger.error('Unexpected error creating AI Insight with PDF', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights by category
  async getByCategory(category: string, userId?: string) {
    try {
      this.insightsLogger.debug('Getting AI Insights by category', { category, userId });
      
      const filters: AIInsightFilters = { category };
      if (userId) filters.user_id = userId;

      return await this.findAll(filters);
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights by category', { category, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights by priority
  async getByPriority(priority: string, userId?: string) {
    try {
      this.insightsLogger.debug('Getting AI Insights by priority', { priority, userId });
      
      const filters: AIInsightFilters = { priority };
      if (userId) filters.user_id = userId;

      return await this.findAll(filters);
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights by priority', { priority, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights by status
  async getByStatus(status: string, userId?: string) {
    try {
      this.insightsLogger.debug('Getting AI Insights by status', { status, userId });
      
      const filters: AIInsightFilters = { status };
      if (userId) filters.user_id = userId;

      return await this.findAll(filters);
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights by status', { status, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights by AI model
  async getByModel(aiModel: string, userId?: string) {
    try {
      this.insightsLogger.debug('Getting AI Insights by model', { aiModel, userId });
      
      const filters: AIInsightFilters = { ai_model: aiModel };
      if (userId) filters.user_id = userId;

      return await this.findAll(filters);
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights by model', { aiModel, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Search insights with advanced filters
  async searchWithFilters(filters: AIInsightFilters, page: number = 1, limit: number = 10) {
    try {
      this.insightsLogger.debug('Searching AI Insights with filters', { filters, page, limit });
      
      // Remove search from filters for the main query
      const { search, ...queryFilters } = filters;
      
      if (search) {
        // Use text search if search query is provided
        return await this.search(search, queryFilters);
      } else {
        // Use pagination without search
        return await this.findWithPagination(page, limit, queryFilters);
      }
    } catch (error) {
      this.insightsLogger.error('Error searching AI Insights with filters', { filters, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights summary statistics
  async getSummary(userId?: string): Promise<ApiResponse<AIInsightSummary>> {
    try {
      this.insightsLogger.debug('Getting AI Insights summary', { userId });
      
      // Get all insights for the user
      const allInsightsResult = await this.findAll(userId ? { user_id: userId } : undefined);
      if (!allInsightsResult.success || !allInsightsResult.data) {
        return { success: false, error: allInsightsResult.error, data: null };
      }

      const insights = allInsightsResult.data;
      
      // Calculate summary statistics
      const summary: AIInsightSummary = {
        total: insights.length,
        byCategory: {},
        byStatus: {},
        byPriority: {},
        byModel: {}
      };

      insights.forEach(insight => {
        // Count by category
        const category = insight.category || 'unknown';
        summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;

        // Count by status
        const status = insight.status || 'unknown';
        summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

        // Count by priority
        const priority = insight.priority || 'unknown';
        summary.byPriority[priority] = (summary.byPriority[priority] || 0) + 1;

        // Count by AI model
        const model = insight.ai_model || 'unknown';
        summary.byModel[model] = (summary.byModel[model] || 0) + 1;
      });

      this.insightsLogger.debug('Successfully calculated AI Insights summary', { summary });
      return { success: true, data: summary, error: null };
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights summary', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights with PDF content
  async getWithPDF(insightId: string) {
    try {
      this.insightsLogger.debug('Getting AI Insight with PDF content', { insightId });
      
      const result = await this.findById(insightId);
      if (!result.success || !result.data) {
        return result;
      }

      // Check if PDF content exists
      if (result.data.pdf_content) {
        this.insightsLogger.debug('AI Insight has PDF content', { 
          insightId, 
          pdfSize: result.data.pdf_size,
          pdfFilename: result.data.pdf_filename 
        });
      } else {
        this.insightsLogger.debug('AI Insight has no PDF content', { insightId });
      }

      return result;
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insight with PDF content', { insightId, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Update insight status
  async updateStatus(insightId: string, status: string) {
    try {
      this.insightsLogger.info('Updating AI Insight status', { insightId, status });
      
      return await this.update(insightId, { status });
    } catch (error) {
      this.insightsLogger.error('Error updating AI Insight status', { insightId, status, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Update insight priority
  async updatePriority(insightId: string, priority: string) {
    try {
      this.insightsLogger.info('Updating AI Insight priority', { insightId, priority });
      
      return await this.update(insightId, { priority });
    } catch (error) {
      this.insightsLogger.error('Error updating AI Insight priority', { insightId, priority, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Add tags to insight
  async addTags(insightId: string, newTags: string[]) {
    try {
      this.insightsLogger.info('Adding tags to AI Insight', { insightId, newTags });
      
      // Get current insight
      const currentResult = await this.findById(insightId);
      if (!currentResult.success || !currentResult.data) {
        return currentResult;
      }

      const currentTags = currentResult.data.tags || [];
      const updatedTags = [...new Set([...currentTags, ...newTags])]; // Remove duplicates

      return await this.update(insightId, { tags: updatedTags });
    } catch (error) {
      this.insightsLogger.error('Error adding tags to AI Insight', { insightId, newTags, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Remove tags from insight
  async removeTags(insightId: string, tagsToRemove: string[]) {
    try {
      this.insightsLogger.info('Removing tags from AI Insight', { insightId, tagsToRemove });
      
      // Get current insight
      const currentResult = await this.findById(insightId);
      if (!currentResult.success || !currentResult.data) {
        return currentResult;
      }

      const currentTags = currentResult.data.tags || [];
      const updatedTags = currentTags.filter(tag => !tagsToRemove.includes(tag));

      return await this.update(insightId, { tags: updatedTags });
    } catch (error) {
      this.insightsLogger.error('Error removing tags from AI Insight', { insightId, tagsToRemove, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get insights by date range
  async getByDateRange(startDate: string, endDate: string, userId?: string) {
    try {
      this.insightsLogger.debug('Getting AI Insights by date range', { startDate, endDate, userId });
      
      // This would require a custom query since Supabase doesn't have built-in date range filtering
      // For now, we'll get all insights and filter by date in memory
      const allInsightsResult = await this.findAll(userId ? { user_id: userId } : undefined);
      if (!allInsightsResult.success || !allInsightsResult.data) {
        return allInsightsResult;
      }

      const insights = allInsightsResult.data;
      const filteredInsights = insights.filter(insight => {
        const createdAt = new Date(insight.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return createdAt >= start && createdAt <= end;
      });

      return { success: true, data: filteredInsights, error: null };
    } catch (error) {
      this.insightsLogger.error('Error getting AI Insights by date range', { startDate, endDate, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Get recent insights (last N days)
  async getRecent(days: number = 7, userId?: string) {
    try {
      this.insightsLogger.debug('Getting recent AI Insights', { days, userId });
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await this.getByDateRange(startDate.toISOString(), endDate.toISOString(), userId);
    } catch (error) {
      this.insightsLogger.error('Error getting recent AI Insights', { days, error });
      return { success: false, error: String(error), data: null };
    }
  }
}
