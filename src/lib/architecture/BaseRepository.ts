import { IRepository, QueryOptions, PaginationResult } from './types/base';

/**
 * Base Repository Class
 * 
 * Provides common repository functionality and implements the IRepository interface.
 * All repositories should extend this base class to inherit common functionality.
 */
export abstract class BaseRepository<T> implements IRepository<T> {
  protected client: any;
  protected logger: any;
  protected tableName: string;
  protected primaryKey: string;

  constructor(client?: any, logger?: any, tableName?: string, primaryKey: string = 'id') {
    this.client = client;
    this.logger = logger;
    this.tableName = tableName || 'default_table';
    this.primaryKey = primaryKey;
  }

  /**
   * Create a new record
   * @param data - Data to create
   * @returns Promise<T>
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      this.logOperation('create', { data });
      
      // Validate data
      const validationResult = await this.validateData(data);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors?.join(', ')}`);
      }

      // Generate ID if not provided
      const dataWithId = this.generateId(data);
      
      // Perform creation
      const result = await this.performCreate(dataWithId);
      
      this.logSuccess('create', { data }, result);
      return result;
    } catch (error) {
      this.logError('create', { data }, error);
      throw error;
    }
  }

  /**
   * Read a record by ID
   * @param id - Record ID
   * @returns Promise<T | null>
   */
  async read(id: string): Promise<T | null> {
    try {
      this.logOperation('read', { id });
      
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid ID provided');
      }

      // Check cache first
      const cacheKey = `read_${id}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      // Perform read
      const result = await this.performRead(id);
      
      // Cache result
      if (result) {
        this.setCachedData(cacheKey, result);
      }
      
      this.logSuccess('read', { id }, result);
      return result;
    } catch (error) {
      this.logError('read', { id }, error);
      throw error;
    }
  }

  /**
   * Update a record
   * @param id - Record ID
   * @param data - Data to update
   * @returns Promise<T>
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      this.logOperation('update', { id, data });
      
      // Validate data
      const validationResult = await this.validateData(data);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors?.join(', ')}`);
      }

      // Check if record exists
      const existing = await this.read(id);
      if (!existing) {
        throw new Error(`Record with ID ${id} not found`);
      }

      // Perform update
      const result = await this.performUpdate(id, data);
      
      // Clear cache
      this.clearCache(`read_${id}`);
      
      this.logSuccess('update', { id, data }, result);
      return result;
    } catch (error) {
      this.logError('update', { id, data }, error);
      throw error;
    }
  }

  /**
   * Delete a record
   * @param id - Record ID
   * @returns Promise<boolean>
   */
  async delete(id: string): Promise<boolean> {
    try {
      this.logOperation('delete', { id });
      
      // Validate ID
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid ID provided');
      }

      // Check if record exists
      const existing = await this.read(id);
      if (!existing) {
        throw new Error(`Record with ID ${id} not found`);
      }

      // Perform deletion
      const result = await this.performDelete(id);
      
      // Clear cache
      this.clearCache(`read_${id}`);
      
      this.logSuccess('delete', { id }, result);
      return result;
    } catch (error) {
      this.logError('delete', { id }, error);
      throw error;
    }
  }

  /**
   * Find records with query options
   * @param options - Query options
   * @returns Promise<T[]>
   */
  async find(options: QueryOptions = {}): Promise<T[]> {
    try {
      this.logOperation('find', { options });
      
      // Validate options
      const validationResult = await this.validateQueryOptions(options);
      if (!validationResult.isValid) {
        throw new Error(`Query options validation failed: ${validationResult.errors?.join(', ')}`);
      }

      // Check cache
      const cacheKey = `find_${JSON.stringify(options)}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      // Perform find
      const result = await this.performFind(options);
      
      // Cache result
      this.setCachedData(cacheKey, result);
      
      this.logSuccess('find', { options }, result);
      return result;
    } catch (error) {
      this.logError('find', { options }, error);
      throw error;
    }
  }

  /**
   * Find records with pagination
   * @param options - Query options
   * @param page - Page number
   * @param limit - Records per page
   * @returns Promise<PaginationResult<T>>
   */
  async findWithPagination(
    options: QueryOptions = {}, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginationResult<T>> {
    try {
      this.logOperation('findWithPagination', { options, page, limit });
      
      // Validate pagination parameters
      if (page < 1 || limit < 1) {
        throw new Error('Invalid pagination parameters');
      }

      // Calculate offset
      const offset = (page - 1) * limit;
      
      // Get total count
      const total = await this.count(options);
      
      // Get paginated results
      const data = await this.performFindWithPagination(options, offset, limit);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;
      
      const result: PaginationResult<T> = {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      };
      
      this.logSuccess('findWithPagination', { options, page, limit }, result);
      return result;
    } catch (error) {
      this.logError('findWithPagination', { options, page, limit }, error);
      throw error;
    }
  }

  /**
   * Count records matching query options
   * @param options - Query options
   * @returns Promise<number>
   */
  async count(options: QueryOptions = {}): Promise<number> {
    try {
      this.logOperation('count', { options });
      
      // Check cache
      const cacheKey = `count_${JSON.stringify(options)}`;
      const cached = this.getCachedData(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      // Perform count
      const result = await this.performCount(options);
      
      // Cache result
      this.setCachedData(cacheKey, result);
      
      this.logSuccess('count', { options }, result);
      return result;
    } catch (error) {
      this.logError('count', { options }, error);
      throw error;
    }
  }

  /**
   * Perform the actual create operation - to be implemented by subclasses
   * @param data - Data to create
   * @returns Promise<T>
   */
  protected abstract performCreate(data: Partial<T>): Promise<T>;

  /**
   * Perform the actual read operation - to be implemented by subclasses
   * @param id - Record ID
   * @returns Promise<T | null>
   */
  protected abstract performRead(id: string): Promise<T | null>;

  /**
   * Perform the actual update operation - to be implemented by subclasses
   * @param id - Record ID
   * @param data - Data to update
   * @returns Promise<T>
   */
  protected abstract performUpdate(id: string, data: Partial<T>): Promise<T>;

  /**
   * Perform the actual delete operation - to be implemented by subclasses
   * @param id - Record ID
   * @returns Promise<boolean>
   */
  protected abstract performDelete(id: string): Promise<boolean>;

  /**
   * Perform the actual find operation - to be implemented by subclasses
   * @param options - Query options
   * @returns Promise<T[]>
   */
  protected abstract performFind(options: QueryOptions): Promise<T[]>;

  /**
   * Perform the actual find with pagination operation - to be implemented by subclasses
   * @param options - Query options
   * @param offset - Offset for pagination
   * @param limit - Limit for pagination
   * @returns Promise<T[]>
   */
  protected abstract performFindWithPagination(
    options: QueryOptions, 
    offset: number, 
    limit: number
  ): Promise<T[]>;

  /**
   * Perform the actual count operation - to be implemented by subclasses
   * @param options - Query options
   * @returns Promise<number>
   */
  protected abstract performCount(options: QueryOptions): Promise<number>;

  /**
   * Validate data - can be overridden by subclasses
   * @param data - Data to validate
   * @returns Promise<{isValid: boolean, errors?: string[]}>
   */
  protected async validateData(data: any): Promise<{isValid: boolean, errors?: string[]}> {
    // Basic validation - check if data exists
    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Data must be a valid object'] };
    }

    // Subclasses can override this for specific validation logic
    return { isValid: true };
  }

  /**
   * Validate query options - can be overridden by subclasses
   * @param options - Query options to validate
   * @returns Promise<{isValid: boolean, errors?: string[]}>
   */
  protected async validateQueryOptions(options: any): Promise<{isValid: boolean, errors?: string[]}> {
    // Basic validation - check if options is an object
    if (options && typeof options !== 'object') {
      return { isValid: false, errors: ['Query options must be a valid object'] };
    }

    // Subclasses can override this for specific validation logic
    return { isValid: true };
  }

  /**
   * Generate ID for new records - can be overridden by subclasses
   * @param data - Data object
   * @returns Data with generated ID
   */
  protected generateId(data: Partial<T>): Partial<T> {
    if (!data[this.primaryKey as keyof T]) {
      // Generate UUID-like ID
      const id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { ...data, [this.primaryKey]: id } as Partial<T>;
    }
    return data;
  }

  // Cache management methods (similar to BaseService)
  private cache = new Map<string, any>();

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key);
    }
    
    return undefined;
  }

  private setCachedData(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Logging methods
  private logOperation(operation: string, data: any): void {
    if (this.logger) {
      this.logger.info(`Repository operation started: ${operation}`, {
        operation,
        tableName: this.tableName,
        timestamp: new Date().toISOString()
      });
    }
  }

  private logSuccess(operation: string, input: any, result: any): void {
    if (this.logger) {
      this.logger.info(`Repository operation completed successfully: ${operation}`, {
        operation,
        tableName: this.tableName,
        timestamp: new Date().toISOString()
      });
    }
  }

  private logError(operation: string, input: any, error: any): void {
    if (this.logger) {
      this.logger.error(`Repository operation failed: ${operation}`, {
        operation,
        tableName: this.tableName,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get repository metadata
   * @returns Object with repository information
   */
  getMetadata(): { name: string; version: string; description: string; tableName: string } {
    return {
      name: this.constructor.name,
      version: '1.0.0',
      description: 'Base Repository Implementation',
      tableName: this.tableName
    };
  }
}
