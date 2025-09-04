/**
 * 🗄️ Base Repository - Foundation voor alle repositories
 * 
 * Implementeert de basis functionaliteit voor alle repositories
 * volgens de AI Workflow Guide - Supabase Workflow Fundamentals
 */

import { IRepository, ITransactionRepository, BaseEntity, QueryFilters, Transaction } from '../types/base';
import { ILogger } from '../types/base';

export abstract class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected logger: ILogger;
  protected repositoryName: string;
  protected tableName: string;

  constructor(logger: ILogger, repositoryName: string, tableName: string) {
    this.logger = logger;
    this.repositoryName = repositoryName;
    this.tableName = tableName;
  }

  /**
   * ➕ Create nieuwe entity
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('create');

    try {
      this.logger.info(`[${this.repositoryName}] Create operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer data
      const validatedData = await this.validateCreateData(data);

      // 2. Generate ID en timestamps
      const entityData = {
        ...validatedData,
        id: this.generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 3. Execute create operation
      const result = await this.executeCreate(entityData);

      // 4. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] Create operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: result.id
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] Create operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        error: errorMessage
      });

      throw error;
    }
  }

  /**
   * 📖 Read entity by ID
   */
  async read(id: string): Promise<T | null> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('read');

    try {
      this.logger.info(`[${this.repositoryName}] Read operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        entityId: id,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer ID
      if (!this.isValidId(id)) {
        throw new Error('Invalid entity ID');
      }

      // 2. Execute read operation
      const result = await this.executeRead(id);

      // 3. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] Read operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id,
        found: !!result
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] Read operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id,
        error: errorMessage
      });

      throw error;
    }
  }

  /**
   * 📚 Read multiple entities
   */
  async readMany(filters?: QueryFilters): Promise<T[]> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('readMany');

    try {
      this.logger.info(`[${this.repositoryName}] ReadMany operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        filters,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer filters
      const validatedFilters = this.validateQueryFilters(filters);

      // 2. Execute readMany operation
      const result = await this.executeReadMany(validatedFilters);

      // 3. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] ReadMany operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        resultCount: result.length,
        filters: validatedFilters
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] ReadMany operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        filters,
        error: errorMessage
      });

      throw error;
    }
  }

  /**
   * ✏️ Update entity
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('update');

    try {
      this.logger.info(`[${this.repositoryName}] Update operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        entityId: id,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer ID en data
      if (!this.isValidId(id)) {
        throw new Error('Invalid entity ID');
      }

      const validatedData = await this.validateUpdateData(data);

      // 2. Add updated_at timestamp
      const updateData = {
        ...validatedData,
        updated_at: new Date().toISOString()
      };

      // 3. Execute update operation
      const result = await this.executeUpdate(id, updateData);

      // 4. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] Update operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] Update operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id,
        error: errorMessage
      });

      throw error;
    }
  }

  /**
   * 🗑️ Delete entity
   */
  async delete(id: string): Promise<boolean> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('delete');

    try {
      this.logger.info(`[${this.repositoryName}] Delete operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        entityId: id,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer ID
      if (!this.isValidId(id)) {
        throw new Error('Invalid entity ID');
      }

      // 2. Check if entity exists
      const exists = await this.exists(id);
      if (!exists) {
        throw new Error(`Entity with ID ${id} not found`);
      }

      // 3. Execute delete operation
      const result = await this.executeDelete(id);

      // 4. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] Delete operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id,
        result
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] Delete operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        entityId: id,
        error: errorMessage
      });

      throw error;
    }
  }

  /**
   * 🔍 Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const entity = await this.read(id);
      return !!entity;
    } catch (error) {
      return false;
    }
  }

  /**
   * 📊 Count entities
   */
  async count(filters?: QueryFilters): Promise<number> {
    const startTime = Date.now();
    const operationId = this.generateOperationId('count');

    try {
      this.logger.info(`[${this.repositoryName}] Count operation started`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        filters,
        timestamp: new Date().toISOString()
      });

      // 1. Valideer filters
      const validatedFilters = this.validateQueryFilters(filters);

      // 2. Execute count operation
      const result = await this.executeCount(validatedFilters);

      // 3. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.repositoryName}] Count operation completed successfully`, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        count: result,
        filters: validatedFilters
      });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.repositoryName}] Count operation failed`, error, {
        operationId,
        repository: this.repositoryName,
        table: this.tableName,
        duration,
        timestamp: new Date().toISOString(),
        filters,
        error: errorMessage
      });

      throw error;
    }
  }

  // ============================================================================
  // ABSTRACT METHODS - MOETEN GEÏMPLEMENTEERD WORDEN DOOR SUBCLASSES
  // ============================================================================

  protected abstract executeCreate(data: T): Promise<T>;
  protected abstract executeRead(id: string): Promise<T | null>;
  protected abstract executeReadMany(filters: QueryFilters): Promise<T[]>;
  protected abstract executeUpdate(id: string, data: Partial<T>): Promise<T>;
  protected abstract executeDelete(id: string): Promise<boolean>;
  protected abstract executeCount(filters: QueryFilters): Promise<number>;

  // ============================================================================
  // PROTECTED HELPER METHODS
  // ============================================================================

  /**
   * 🆔 Genereer unieke operation ID
   */
  protected generateOperationId(operation: string): string {
    return `${this.repositoryName}-${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🆔 Genereer unieke entity ID
   */
  protected generateId(): string {
    return `${this.tableName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * ✅ Valideer entity ID
   */
  protected isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0;
  }

  /**
   * ✅ Valideer create data
   */
  protected async validateCreateData(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<Omit<T, 'id' | 'created_at' | 'updated_at'>> {
    // Placeholder implementation - kan uitgebreid worden door subclasses
    return data;
  }

  /**
   * ✅ Valideer update data
   */
  protected async validateUpdateData(data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<Partial<Omit<T, 'id' | 'created_at'>>> {
    // Placeholder implementation - kan uitgebreid worden door subclasses
    return data;
  }

  /**
   * ✅ Valideer query filters
   */
  protected validateQueryFilters(filters?: QueryFilters): QueryFilters {
    // Placeholder implementation - kan uitgebreid worden door subclasses
    return filters || {};
  }

  /**
   * 📊 Log performance metrics
   */
  protected logPerformanceMetrics(
    operation: string,
    duration: number,
    operationId: string,
    additionalData?: Record<string, any>
  ): void {
    this.logger.info(`[${this.repositoryName}] Performance metric`, {
      operationId,
      repository: this.repositoryName,
      table: this.tableName,
      operation,
      duration,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }
}

/**
 * 🗄️ Base Transaction Repository - Foundation voor transaction repositories
 */
export abstract class BaseTransactionRepository<T extends BaseEntity> 
  extends BaseRepository<T> 
  implements ITransactionRepository<T> {
  
  protected activeTransactions: Map<string, Transaction> = new Map();

  constructor(logger: ILogger, repositoryName: string, tableName: string) {
    super(logger, repositoryName, tableName);
  }

  /**
   * 🚀 Begin transaction
   */
  async beginTransaction(): Promise<Transaction> {
    const transactionId = this.generateTransactionId();
    
    try {
      this.logger.info(`[${this.repositoryName}] Transaction started`, {
        transactionId,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

      const transaction: Transaction = {
        id: transactionId,
        status: 'active'
      };

      this.activeTransactions.set(transactionId, transaction);
      
      // Execute begin transaction (moet geïmplementeerd worden door subclasses)
      await this.executeBeginTransaction(transaction);

      return transaction;

    } catch (error) {
      this.logger.error(`[${this.repositoryName}] Failed to start transaction`, error, {
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * ✅ Commit transaction
   */
  async commit(transaction: Transaction): Promise<void> {
    try {
      this.logger.info(`[${this.repositoryName}] Transaction commit started`, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

      // Execute commit (moet geïmplementeerd worden door subclasses)
      await this.executeCommit(transaction);

      // Update transaction status
      transaction.status = 'committed';
      this.activeTransactions.delete(transaction.id);

      this.logger.info(`[${this.repositoryName}] Transaction committed successfully`, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error(`[${this.repositoryName}] Failed to commit transaction`, error, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * 🔄 Rollback transaction
   */
  async rollback(transaction: Transaction): Promise<void> {
    try {
      this.logger.info(`[${this.repositoryName}] Transaction rollback started`, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

      // Execute rollback (moet geïmplementeerd worden door subclasses)
      await this.executeRollback(transaction);

      // Update transaction status
      transaction.status = 'rolled_back';
      this.activeTransactions.delete(transaction.id);

      this.logger.info(`[${this.repositoryName}] Transaction rolled back successfully`, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error(`[${this.repositoryName}] Failed to rollback transaction`, error, {
        transactionId: transaction.id,
        repository: this.repositoryName,
        table: this.tableName,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * 🆔 Genereer unieke transaction ID
   */
  private generateTransactionId(): string {
    return `${this.repositoryName}-txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // ABSTRACT METHODS VOOR TRANSACTIONS
  // ============================================================================

  protected abstract executeBeginTransaction(transaction: Transaction): Promise<void>;
  protected abstract executeCommit(transaction: Transaction): Promise<void>;
  protected abstract executeRollback(transaction: Transaction): Promise<void>;
}
