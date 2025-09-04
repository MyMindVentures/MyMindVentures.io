import { BaseController } from './BaseController';
import { AIInsightsService } from '../services/AIInsightsService';
import { 
  AIInsightCreateRequest, 
  AIInsightUpdateRequest,
  AIInsightFilters,
  AIInsightBulkOperation
} from '../types/ai-insights';
import { Logger } from '../utils/Logger';
import { ApiResponse } from '../types/base';

export interface AIInsightsControllerConfig {
  insightsService: AIInsightsService;
  enableAuthentication?: boolean;
  enableRateLimiting?: boolean;
  maxFileSize?: number; // in bytes
}

export class AIInsightsController extends BaseController {
  private insightsService: AIInsightsService;
  private controllerLogger: Logger;
  private config: AIInsightsControllerConfig;

  constructor(config: AIInsightsControllerConfig) {
    super();
    this.insightsService = config.insightsService;
    this.config = config;
    this.controllerLogger = new Logger('AIInsightsController');
  }

  // Create new AI Insight
  async createInsight(request: {
    body: AIInsightCreateRequest;
    files?: { pdf?: Express.Multer.File };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.info('Creating new AI Insight', { 
        title: request.body.title,
        userId: request.user?.id 
      });

      // Pre-processing: Authentication check
      if (this.config.enableAuthentication && !request.user?.id) {
        return { 
          success: false, 
          error: 'Authentication required', 
          data: null,
          statusCode: 401 
        };
      }

      // Pre-processing: Input validation
      const validationResult = await this.validateCreateRequest(request.body);
      if (!validationResult.success) {
        return { 
          success: false, 
          error: validationResult.error, 
          data: null,
          statusCode: 400 
        };
      }

      // Pre-processing: File validation
      if (request.files?.pdf) {
        const fileValidation = this.validatePDFFile(request.files.pdf);
        if (!fileValidation.success) {
          return { 
            success: false, 
            error: fileValidation.error, 
            data: null,
            statusCode: 400 
          };
        }
      }

      // Set user ID from authenticated user
      if (request.user?.id) {
        request.body.user_id = request.user.id;
      }

      // Execute business logic via service
      const result = await this.insightsService.createInsight(
        request.body,
        request.files?.pdf ? Buffer.from(request.files.pdf.buffer) : undefined,
        request.files?.pdf ? request.files.pdf.originalname : undefined
      );

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 201; // Created
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Unexpected error creating AI Insight', { error });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Get AI Insights with filtering and pagination
  async getInsights(request: {
    query: {
      page?: string;
      limit?: string;
      category?: string;
      priority?: string;
      status?: string;
      ai_model?: string;
      search?: string;
      date_from?: string;
      date_to?: string;
    };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.debug('Getting AI Insights', { 
        query: request.query,
        userId: request.user?.id 
      });

      // Pre-processing: Parse and validate query parameters
      const page = parseInt(request.query.page || '1');
      const limit = parseInt(request.query.limit || '10');
      
      if (page < 1 || limit < 1 || limit > 100) {
        return { 
          success: false, 
          error: 'Invalid pagination parameters', 
          data: null,
          statusCode: 400 
        };
      }

      // Build filters
      const filters: AIInsightFilters = {};
      if (request.query.category) filters.category = request.query.category as any;
      if (request.query.priority) filters.priority = request.query.priority as any;
      if (request.query.status) filters.status = request.query.status as any;
      if (request.query.ai_model) filters.ai_model = request.query.ai_model;
      if (request.query.search) filters.search = request.query.search;
      if (request.query.date_from) filters.date_from = request.query.date_from;
      if (request.query.date_to) filters.date_to = request.query.date_to;

      // Apply user filtering if authenticated
      if (request.user?.id) {
        filters.user_id = request.user.id;
      }

      // Execute business logic via service
      const result = await this.insightsService.getInsights(filters, page, limit);

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error getting AI Insights', { error });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Get AI Insight by ID
  async getInsightById(request: {
    params: { id: string };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.debug('Getting AI Insight by ID', { 
        insightId: request.params.id,
        userId: request.user?.id 
      });

      // Pre-processing: Validate ID format
      if (!this.isValidUUID(request.params.id)) {
        return { 
          success: false, 
          error: 'Invalid insight ID format', 
          data: null,
          statusCode: 400 
        };
      }

      // Execute business logic via service
      const result = await this.insightsService.getInsightById(request.params.id);

      // Post-processing: Check if found
      if (result.success && result.data) {
        result.statusCode = 200; // OK
      } else if (result.success && !result.data) {
        result.statusCode = 404; // Not Found
        result.error = 'AI Insight not found';
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error getting AI Insight by ID', { 
        insightId: request.params.id, 
        error 
      });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Update AI Insight
  async updateInsight(request: {
    params: { id: string };
    body: AIInsightUpdateRequest;
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.info('Updating AI Insight', { 
        insightId: request.params.id,
        userId: request.user?.id,
        updates: Object.keys(request.body)
      });

      // Pre-processing: Authentication check
      if (this.config.enableAuthentication && !request.user?.id) {
        return { 
          success: false, 
          error: 'Authentication required', 
          data: null,
          statusCode: 401 
        };
      }

      // Pre-processing: Validate ID format
      if (!this.isValidUUID(request.params.id)) {
        return { 
          success: false, 
          error: 'Invalid insight ID format', 
          data: null,
          statusCode: 400 
        };
      }

      // Pre-processing: Input validation
      const validationResult = await this.validateUpdateRequest(request.body);
      if (!validationResult.success) {
        return { 
          success: false, 
          error: validationResult.error, 
          data: null,
          statusCode: 400 
        };
      }

      // Execute business logic via service
      const result = await this.insightsService.updateInsight(
        request.params.id,
        request.body
      );

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error updating AI Insight', { 
        insightId: request.params.id, 
        error 
      });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Delete AI Insight
  async deleteInsight(request: {
    params: { id: string };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.info('Deleting AI Insight', { 
        insightId: request.params.id,
        userId: request.user?.id 
      });

      // Pre-processing: Authentication check
      if (this.config.enableAuthentication && !request.user?.id) {
        return { 
          success: false, 
          error: 'Authentication required', 
          data: null,
          statusCode: 401 
        };
      }

      // Pre-processing: Validate ID format
      if (!this.isValidUUID(request.params.id)) {
        return { 
          success: false, 
          error: 'Invalid insight ID format', 
          data: null,
          statusCode: 400 
        };
      }

      // Execute business logic via service
      const result = await this.insightsService.deleteInsight(request.params.id);

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error deleting AI Insight', { 
        insightId: request.params.id, 
        error 
      });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Search AI Insights
  async searchInsights(request: {
    query: {
      q: string;
      category?: string;
      priority?: string;
      status?: string;
      ai_model?: string;
    };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.debug('Searching AI Insights', { 
        query: request.query.q,
        filters: request.query,
        userId: request.user?.id 
      });

      // Pre-processing: Validate search query
      if (!request.query.q || request.query.q.trim().length < 2) {
        return { 
          success: false, 
          error: 'Search query must be at least 2 characters long', 
          data: null,
          statusCode: 400 
        };
      }

      // Build filters
      const filters: AIInsightFilters = {};
      if (request.query.category) filters.category = request.query.category as any;
      if (request.query.priority) filters.priority = request.query.priority as any;
      if (request.query.status) filters.status = request.query.status as any;
      if (request.query.ai_model) filters.ai_model = request.query.ai_model;

      // Apply user filtering if authenticated
      if (request.user?.id) {
        filters.user_id = request.user.id;
      }

      // Execute business logic via service
      const result = await this.insightsService.searchInsights(
        request.query.q.trim(),
        filters
      );

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error searching AI Insights', { error });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Get AI Insights summary
  async getInsightsSummary(request: {
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.debug('Getting AI Insights summary', { 
        userId: request.user?.id 
      });

      // Execute business logic via service
      const result = await this.insightsService.getInsightsSummary(
        request.user?.id
      );

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error getting AI Insights summary', { error });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Execute bulk operations
  async executeBulkOperation(request: {
    body: AIInsightBulkOperation;
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.info('Executing bulk operation', { 
        operation: request.body.operation,
        insightCount: request.body.insightIds.length,
        userId: request.user?.id 
      });

      // Pre-processing: Authentication check
      if (this.config.enableAuthentication && !request.user?.id) {
        return { 
          success: false, 
          error: 'Authentication required', 
          data: null,
          statusCode: 401 
        };
      }

      // Pre-processing: Input validation
      const validationResult = await this.validateBulkOperation(request.body);
      if (!validationResult.success) {
        return { 
          success: false, 
          error: validationResult.error, 
          data: null,
          statusCode: 400 
        };
      }

      // Set user ID from authenticated user
      if (request.user?.id) {
        request.body.user_id = request.user.id;
      }

      // Execute business logic via service
      const result = await this.insightsService.executeBulkOperation(request.body);

      // Post-processing: Set appropriate status code
      if (result.success) {
        result.statusCode = 200; // OK
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error executing bulk operation', { error });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Get AI Insight PDF content
  async getInsightPDF(request: {
    params: { id: string };
    user?: { id: string; role?: string };
  }): Promise<ApiResponse<any>> {
    try {
      this.controllerLogger.debug('Getting AI Insight PDF', { 
        insightId: request.params.id,
        userId: request.user?.id 
      });

      // Pre-processing: Validate ID format
      if (!this.isValidUUID(request.params.id)) {
        return { 
          success: false, 
          error: 'Invalid insight ID format', 
          data: null,
          statusCode: 400 
        };
      }

      // Execute business logic via service
      const result = await this.insightsService.getInsightWithPDF(request.params.id);

      // Post-processing: Check if found and has PDF
      if (result.success && result.data) {
        if (result.data.pdf_content) {
          result.statusCode = 200; // OK
        } else {
          result.statusCode = 404; // Not Found
          result.error = 'PDF content not available for this insight';
        }
      } else if (result.success && !result.data) {
        result.statusCode = 404; // Not Found
        result.error = 'AI Insight not found';
      } else {
        result.statusCode = 400; // Bad Request
      }

      return result;
    } catch (error) {
      this.controllerLogger.error('Error getting AI Insight PDF', { 
        insightId: request.params.id, 
        error 
      });
      return { 
        success: false, 
        error: String(error), 
        data: null,
        statusCode: 500 
      };
    }
  }

  // Private helper methods
  private async validateCreateRequest(request: AIInsightCreateRequest): Promise<ApiResponse<boolean>> {
    // Validate required fields
    if (!request.title || !request.content || !request.category || !request.priority || !request.status) {
      return { success: false, error: 'Missing required fields', data: false };
    }

    // Validate string lengths
    if (request.title.length > 500) {
      return { success: false, error: 'Title too long (max 500 characters)', data: false };
    }

    if (request.content.length > 100000) {
      return { success: false, error: 'Content too long (max 100,000 characters)', data: false };
    }

    // Validate arrays
    if (request.tags && request.tags.length > 50) {
      return { success: false, error: 'Too many tags (max 50)', data: false };
    }

    return { success: true, data: true, error: null };
  }

  private async validateUpdateRequest(request: AIInsightUpdateRequest): Promise<ApiResponse<boolean>> {
    // Validate string lengths if provided
    if (request.title && request.title.length > 500) {
      return { success: false, error: 'Title too long (max 500 characters)', data: false };
    }

    if (request.content && request.content.length > 100000) {
      return { success: false, error: 'Content too long (max 100,000 characters)', data: false };
    }

    // Validate arrays if provided
    if (request.tags && request.tags.length > 50) {
      return { success: false, error: 'Too many tags (max 50)', data: false };
    }

    return { success: true, data: true, error: null };
  }

  private validatePDFFile(file: Express.Multer.File): ApiResponse<boolean> {
    // Check file size
    if (file.size > (this.config.maxFileSize || 10 * 1024 * 1024)) { // Default 10MB
      return { 
        success: false, 
        error: `File too large (max ${this.config.maxFileSize || 10 * 1024 * 1024} bytes)`, 
        data: false 
      };
    }

    // Check file type
    if (file.mimetype !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are allowed', data: false };
    }

    return { success: true, data: true, error: null };
  }

  private async validateBulkOperation(operation: AIInsightBulkOperation): Promise<ApiResponse<boolean>> {
    // Validate operation type
    const validOperations = ['update', 'delete', 'archive', 'change-status', 'change-priority'];
    if (!validOperations.includes(operation.operation)) {
      return { success: false, error: 'Invalid operation type', data: false };
    }

    // Validate insight IDs
    if (!operation.insightIds || operation.insightIds.length === 0) {
      return { success: false, error: 'No insight IDs provided', data: false };
    }

    if (operation.insightIds.length > 100) {
      return { success: false, error: 'Bulk operation limited to 100 insights', data: false };
    }

    // Validate UUIDs
    for (const id of operation.insightIds) {
      if (!this.isValidUUID(id)) {
        return { success: false, error: `Invalid insight ID format: ${id}`, data: false };
      }
    }

    return { success: true, data: true, error: null };
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
