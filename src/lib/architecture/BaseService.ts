import { IService, ServiceResult } from './types/base';

/**
 * Base Service Class
 * 
 * Provides common service functionality and implements the IService interface.
 * All services should extend this base class to inherit common functionality.
 */
export abstract class BaseService<T> implements IService<T> {
  protected repository: any;
  protected logger: any;
  protected cache: Map<string, any>;

  constructor(repository?: any, logger?: any) {
    this.repository = repository;
    this.logger = logger;
    this.cache = new Map();
  }

  /**
   * Execute the service operation
   * @param data - Input data for the service operation
   * @returns Promise<ServiceResult<T>>
   */
  async execute(data: any): Promise<ServiceResult<T>> {
    try {
      this.logOperation('execute', data);
      
      // Validate input data
      const validationResult = await this.validateInput(data);
      if (!validationResult.isValid) {
        return this.createErrorResult('Validation Error', validationResult.errors);
      }

      // Process the operation
      const result = await this.processOperation(data);
      
      // Log success
      this.logSuccess('execute', data, result);
      
      return this.createSuccessResult(result);
    } catch (error) {
      // Log error
      this.logError('execute', data, error);
      
      // Return error result
      return this.createErrorResult(
        'Service execution failed',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Process the actual operation - to be implemented by subclasses
   * @param data - Input data for the operation
   * @returns Promise<T>
   */
  protected abstract processOperation(data: any): Promise<T>;

  /**
   * Validate input data - can be overridden by subclasses
   * @param data - Input data to validate
   * @returns Promise<{isValid: boolean, errors?: string[]}>
   */
  protected async validateInput(data: any): Promise<{isValid: boolean, errors?: string[]}> {
    // Basic validation - check if data exists
    if (data === null || data === undefined) {
      return { isValid: false, errors: ['Input data is required'] };
    }

    // Subclasses can override this for specific validation logic
    return { isValid: true };
  }

  /**
   * Create a success result
   * @param data - The result data
   * @returns ServiceResult<T>
   */
  protected createSuccessResult(data: T): ServiceResult<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      metadata: {
        executionTime: Date.now(),
        cacheHit: false
      }
    };
  }

  /**
   * Create an error result
   * @param message - Error message
   * @param details - Additional error details
   * @returns ServiceResult<T>
   */
  protected createErrorResult(message: string, details?: any): ServiceResult<T> {
    return {
      success: false,
      error: {
        message,
        details,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get cached data
   * @param key - Cache key
   * @returns Cached data or undefined
   */
  protected getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      this.logCacheHit(key);
      return cached.data;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return undefined;
  }

  /**
   * Set cached data
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  protected setCachedData(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
    this.logCacheSet(key, ttl);
  }

  /**
   * Clear cache
   * @param key - Optional specific key to clear, or clear all if not provided
   */
  protected clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
      this.logCacheClear(key);
    } else {
      this.cache.clear();
      this.logCacheClear('all');
    }
  }

  /**
   * Log operation start
   * @param operation - Operation name
   * @param data - Input data
   */
  protected logOperation(operation: string, data: any): void {
    if (this.logger) {
      this.logger.info(`Service operation started: ${operation}`, {
        operation,
        timestamp: new Date().toISOString(),
        dataType: typeof data
      });
    }
  }

  /**
   * Log successful operation
   * @param operation - Operation name
   * @param input - Input data
   * @param result - Operation result
   */
  protected logSuccess(operation: string, input: any, result: T): void {
    if (this.logger) {
      this.logger.info(`Service operation completed successfully: ${operation}`, {
        operation,
        timestamp: new Date().toISOString(),
        inputType: typeof input,
        resultType: typeof result
      });
    }
  }

  /**
   * Log error
   * @param operation - Operation name
   * @param input - Input data
   * @param error - The error that occurred
   */
  protected logError(operation: string, input: any, error: any): void {
    if (this.logger) {
      this.logger.error(`Service operation failed: ${operation}`, {
        operation,
        inputType: typeof input,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log cache hit
   * @param key - Cache key
   */
  protected logCacheHit(key: string): void {
    if (this.logger) {
      this.logger.debug(`Cache hit for key: ${key}`);
    }
  }

  /**
   * Log cache set
   * @param key - Cache key
   * @param ttl - Time to live
   */
  protected logCacheSet(key: string, ttl: number): void {
    if (this.logger) {
      this.logger.debug(`Cache set for key: ${key} with TTL: ${ttl}ms`);
    }
  }

  /**
   * Log cache clear
   * @param key - Cache key or 'all'
   */
  protected logCacheClear(key: string): void {
    if (this.logger) {
      this.logger.debug(`Cache cleared for: ${key}`);
    }
  }

  /**
   * Get service metadata
   * @returns Object with service information
   */
  getMetadata(): { name: string; version: string; description: string } {
    return {
      name: this.constructor.name,
      version: '1.0.0',
      description: 'Base Service Implementation'
    };
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
