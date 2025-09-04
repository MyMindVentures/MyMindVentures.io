import { IController, Request, Response } from './types/base';

/**
 * Base Controller Class
 * 
 * Provides common controller functionality and implements the IController interface.
 * All controllers should extend this base class to inherit common functionality.
 */
export abstract class BaseController<T> implements IController<T> {
  protected service: any;
  protected logger: any;

  constructor(service?: any, logger?: any) {
    this.service = service;
    this.logger = logger;
  }

  /**
   * Handle incoming requests
   * @param request - The incoming request
   * @returns Promise<Response<T>>
   */
  async handle(request: Request): Promise<Response<T>> {
    try {
      this.logRequest(request);
      
      // Validate request
      const validationResult = await this.validateRequest(request);
      if (!validationResult.isValid) {
        return this.createErrorResponse(400, 'Validation Error', validationResult.errors);
      }

      // Process request
      const result = await this.processRequest(request);
      
      // Log success
      this.logSuccess(request, result);
      
      return this.createSuccessResponse(result);
    } catch (error) {
      // Log error
      this.logError(request, error);
      
      // Return error response
      return this.createErrorResponse(
        500,
        'Internal Server Error',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Process the actual request - to be implemented by subclasses
   * @param request - The incoming request
   * @returns Promise<T>
   */
  protected abstract processRequest(request: Request): Promise<T>;

  /**
   * Validate the incoming request - can be overridden by subclasses
   * @param request - The incoming request
   * @returns Promise<{isValid: boolean, errors?: string[]}>
   */
  protected async validateRequest(request: Request): Promise<{isValid: boolean, errors?: string[]}> {
    // Basic validation - check if request has required properties
    if (!request || typeof request !== 'object') {
      return { isValid: false, errors: ['Invalid request format'] };
    }

    // Subclasses can override this for specific validation logic
    return { isValid: true };
  }

  /**
   * Create a success response
   * @param data - The response data
   * @returns Response<T>
   */
  protected createSuccessResponse(data: T): Response<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      statusCode: 200
    };
  }

  /**
   * Create an error response
   * @param statusCode - HTTP status code
   * @param message - Error message
   * @param details - Additional error details
   * @returns Response<T>
   */
  protected createErrorResponse(statusCode: number, message: string, details?: any): Response<T> {
    return {
      success: false,
      error: {
        message,
        details,
        statusCode
      },
      timestamp: new Date().toISOString(),
      statusCode
    };
  }

  /**
   * Log incoming request
   * @param request - The incoming request
   */
  protected logRequest(request: Request): void {
    if (this.logger) {
      this.logger.info('Incoming request', {
        method: request.method,
        url: request.url,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log successful request
   * @param request - The incoming request
   * @param result - The result data
   */
  protected logSuccess(request: Request, result: T): void {
    if (this.logger) {
      this.logger.info('Request processed successfully', {
        method: request.method,
        url: request.url,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log error
   * @param request - The incoming request
   * @param error - The error that occurred
   */
  protected logError(request: Request, error: any): void {
    if (this.logger) {
      this.logger.error('Request processing error', {
        method: request.method,
        url: request.url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get controller metadata
   * @returns Object with controller information
   */
  getMetadata(): { name: string; version: string; description: string } {
    return {
      name: this.constructor.name,
      version: '1.0.0',
      description: 'Base Controller Implementation'
    };
  }
}
