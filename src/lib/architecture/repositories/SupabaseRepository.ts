import { createClient, SupabaseClient } from '@supabase/supabasejs';
import { BaseRepository, IRepository, ITransactionRepository } from './BaseRepository';
import { BaseEntity, ApiResponse } from '../types/base';
import { Logger } from '../utils/Logger';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export class SupabaseRepository<T extends BaseEntity> extends BaseRepository<T> implements IRepository<T> {
  protected supabase: SupabaseClient;
  protected logger: Logger;
  protected tableName: string;

  constructor(config: SupabaseConfig, tableName: string) {
    super();
    this.supabase = createClient(config.url, config.anonKey);
    this.logger = new Logger(`SupabaseRepository:${tableName}`);
    this.tableName = tableName;
  }

  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`Creating ${this.tableName} entity`, { entity: entity.id || 'new' });
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();

      if (error) {
        this.logger.error(`Failed to create ${this.tableName} entity`, { error: error.message });
        return { success: false, error: error.message, data: null };
      }

      this.logger.info(`Successfully created ${this.tableName} entity`, { id: data.id });
      return { success: true, data, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error creating ${this.tableName} entity`, { error });
      return { success: false, error: String(error), data: null };
    }
  }

  async findById(id: string): Promise<ApiResponse<T>> {
    try {
      this.logger.debug(`Finding ${this.tableName} entity by ID`, { id });
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.logger.warn(`Failed to find ${this.tableName} entity by ID`, { id, error: error.message });
        return { success: false, error: error.message, data: null };
      }

      this.logger.debug(`Successfully found ${this.tableName} entity`, { id });
      return { success: true, data, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error finding ${this.tableName} entity by ID`, { id, error });
      return { success: false, error: String(error), data: null };
    }
  }

  async findAll(filters?: Record<string, any>): Promise<ApiResponse<T[]>> {
    try {
      this.logger.debug(`Finding all ${this.tableName} entities`, { filters });
      
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error(`Failed to find ${this.tableName} entities`, { error: error.message });
        return { success: false, error: error.message, data: null };
      }

      this.logger.debug(`Successfully found ${this.tableName} entities`, { count: data?.length || 0 });
      return { success: true, data: data || [], error: null };
    } catch (error) {
      this.logger.error(`Unexpected error finding ${this.tableName} entities`, { error });
      return { success: false, error: String(error), data: null };
    }
  }

  async update(id: string, updates: Partial<T>): Promise<ApiResponse<T>> {
    try {
      this.logger.info(`Updating ${this.tableName} entity`, { id, updates });
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Failed to update ${this.tableName} entity`, { id, error: error.message });
        return { success: false, error: error.message, data: null };
      }

      this.logger.info(`Successfully updated ${this.tableName} entity`, { id });
      return { success: true, data, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error updating ${this.tableName} entity`, { id, error });
      return { success: false, error: String(error), data: null };
    }
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info(`Deleting ${this.tableName} entity`, { id });
      
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Failed to delete ${this.tableName} entity`, { id, error: error.message });
        return { success: false, error: error.message, data: false };
      }

      this.logger.info(`Successfully deleted ${this.tableName} entity`, { id });
      return { success: true, data: true, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error deleting ${this.tableName} entity`, { id, error });
      return { success: false, error: String(error), data: false };
    }
  }

  async exists(id: string): Promise<ApiResponse<boolean>> {
    try {
      this.logger.debug(`Checking if ${this.tableName} entity exists`, { id });
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        this.logger.error(`Failed to check existence of ${this.tableName} entity`, { id, error: error.message });
        return { success: false, error: error.message, data: false };
      }

      const exists = !!data;
      this.logger.debug(`Existence check result for ${this.tableName} entity`, { id, exists });
      return { success: true, data: exists, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error checking existence of ${this.tableName} entity`, { id, error });
      return { success: false, error: String(error), data: false };
    }
  }

  async count(filters?: Record<string, any>): Promise<ApiResponse<number>> {
    try {
      this.logger.debug(`Counting ${this.tableName} entities`, { filters });
      
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) {
        this.logger.error(`Failed to count ${this.tableName} entities`, { error: error.message });
        return { success: false, error: error.message, data: 0 };
      }

      this.logger.debug(`Successfully counted ${this.tableName} entities`, { count: count || 0 });
      return { success: true, data: count || 0, error: null };
    } catch (error) {
      this.logger.error(`Unexpected error counting ${this.tableName} entities`, { error });
      return { success: false, error: String(error), data: 0 };
    }
  }

  // Advanced search with text search
  async search(searchQuery: string, filters?: Record<string, any>): Promise<ApiResponse<T[]>> {
    try {
      this.logger.debug(`Searching ${this.tableName} entities`, { searchQuery, filters });
      
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .textSearch('search_vector', searchQuery)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error(`Failed to search ${this.tableName} entities`, { searchQuery, error: error.message });
        return { success: false, error: error.message, data: null };
      }

      this.logger.debug(`Successfully searched ${this.tableName} entities`, { 
        searchQuery, 
        count: data?.length || 0 
      });
      return { success: true, data: data || [], error: null };
    } catch (error) {
      this.logger.error(`Unexpected error searching ${this.tableName} entities`, { searchQuery, error });
      return { success: false, error: String(error), data: null };
    }
  }

  // Pagination support
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<ApiResponse<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>> {
    try {
      this.logger.debug(`Finding ${this.tableName} entities with pagination`, { page, limit, filters });
      
      const offset = (page - 1) * limit;
      
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, count, error } = await query;

      if (error) {
        this.logger.error(`Failed to find ${this.tableName} entities with pagination`, { 
          page, limit, error: error.message 
        });
        return { success: false, error: error.message, data: null };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      this.logger.debug(`Successfully found ${this.tableName} entities with pagination`, { 
        page, limit, total, totalPages, count: data?.length || 0 
      });

      return {
        success: true,
        data: {
          data: data || [],
          total,
          page,
          limit,
          totalPages
        },
        error: null
      };
    } catch (error) {
      this.logger.error(`Unexpected error finding ${this.tableName} entities with pagination`, { 
        page, limit, error 
      });
      return { success: false, error: String(error), data: null };
    }
  }
}

// Transaction repository for complex operations
export class SupabaseTransactionRepository implements ITransactionRepository {
  private supabase: SupabaseClient;
  private logger: Logger;

  constructor(config: SupabaseConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey || config.anonKey);
    this.logger = new Logger('SupabaseTransactionRepository');
  }

  async executeTransaction<T>(
    operations: (() => Promise<T>)[]
  ): Promise<ApiResponse<T[]>> {
    try {
      this.logger.info('Starting transaction', { operationCount: operations.length });
      
      const results: T[] = [];
      
      for (let i = 0; i < operations.length; i++) {
        try {
          const result = await operations[i]();
          results.push(result);
          this.logger.debug(`Transaction operation ${i + 1} completed successfully`);
        } catch (error) {
          this.logger.error(`Transaction operation ${i + 1} failed`, { error });
          // Rollback would happen here in a real transaction
          return { 
            success: false, 
            error: `Operation ${i + 1} failed: ${String(error)}`, 
            data: null 
          };
        }
      }

      this.logger.info('Transaction completed successfully', { 
        operationCount: operations.length, 
        resultsCount: results.length 
      });
      
      return { success: true, data: results, error: null };
    } catch (error) {
      this.logger.error('Transaction failed', { error });
      return { success: false, error: String(error), data: null };
    }
  }

  async executeBatch<T>(
    operations: (() => Promise<T>)[]
  ): Promise<ApiResponse<T[]>> {
    try {
      this.logger.info('Starting batch operations', { operationCount: operations.length });
      
      const promises = operations.map(op => op());
      const results = await Promise.allSettled(promises);
      
      const successfulResults: T[] = [];
      const errors: string[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulResults.push(result.value);
        } else {
          errors.push(`Operation ${index + 1}: ${String(result.reason)}`);
        }
      });

      if (errors.length > 0) {
        this.logger.warn('Some batch operations failed', { 
          total: operations.length, 
          successful: successfulResults.length, 
          failed: errors.length 
        });
      }

      this.logger.info('Batch operations completed', { 
        total: operations.length, 
        successful: successfulResults.length, 
        failed: errors.length 
      });

      return { 
        success: errors.length === 0, 
        data: successfulResults, 
        error: errors.length > 0 ? errors.join('; ') : null 
      };
    } catch (error) {
      this.logger.error('Batch operations failed', { error });
      return { success: false, error: String(error), data: null };
    }
  }
}
