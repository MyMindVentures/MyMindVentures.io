/**
 * 📝 Logger - Centralized logging voor de hele PWA
 * 
 * Implementeert gestandaardiseerde logging volgens de AI Workflow Guide
 * - Console logging voor development
 * - Supabase logging voor production
 * - Structured logging met context
 * - Performance tracking
 */

import { ILogger } from '../types/base';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  performance?: {
    operation: string;
    duration: number;
    memory?: number;
  };
}

export class Logger implements ILogger {
  private logLevel: LogLevel;
  private serviceName: string;
  private enableConsole: boolean;
  private enableSupabase: boolean;
  private enablePerformance: boolean;

  constructor(
    serviceName: string = 'Logger',
    logLevel: LogLevel = LogLevel.INFO,
    options: {
      enableConsole?: boolean;
      enableSupabase?: boolean;
      enablePerformance?: boolean;
    } = {}
  ) {
    this.serviceName = serviceName;
    this.logLevel = logLevel;
    this.enableConsole = options.enableConsole ?? true;
    this.enableSupabase = options.enableSupabase ?? false;
    this.enablePerformance = options.enablePerformance ?? true;
  }

  /**
   * 🔍 Debug logging
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * ℹ️ Info logging
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * ⚠️ Warning logging
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * ❌ Error logging
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * 📊 Performance logging
   */
  performance(
    operation: string,
    duration: number,
    context?: LogContext,
    memory?: number
  ): void {
    if (!this.enablePerformance) return;

    const performanceContext: LogContext = {
      ...context,
      performance: {
        operation,
        duration,
        memory
      }
    };

    this.info(`Performance: ${operation} completed in ${duration}ms`, performanceContext);
  }

  /**
   * 🔒 Security event logging
   */
  security(event: string, details: LogContext): void {
    const securityContext: LogContext = {
      ...details,
      securityEvent: true,
      severity: this.determineSecuritySeverity(event)
    };

    this.warn(`Security Event: ${event}`, securityContext);
  }

  /**
   * 🧪 Test logging
   */
  test(testName: string, result: 'passed' | 'failed', context?: LogContext): void {
    const testContext: LogContext = {
      ...context,
      testResult: result,
      testName
    };

    if (result === 'passed') {
      this.info(`Test Passed: ${testName}`, testContext);
    } else {
      this.error(`Test Failed: ${testName}`, undefined, testContext);
    }
  }

  /**
   * 🔄 Workflow logging
   */
  workflow(
    workflowId: string,
    step: string,
    status: 'started' | 'completed' | 'failed',
    context?: LogContext
  ): void {
    const workflowContext: LogContext = {
      ...context,
      workflowId,
      step,
      workflowStatus: status
    };

    switch (status) {
      case 'started':
        this.info(`Workflow Step Started: ${step}`, workflowContext);
        break;
      case 'completed':
        this.info(`Workflow Step Completed: ${step}`, workflowContext);
        break;
      case 'failed':
        this.error(`Workflow Step Failed: ${step}`, undefined, workflowContext);
        break;
    }
  }

  /**
   * 🎯 Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    // Check log level
    if (!this.shouldLog(level)) return;

    // Create log entry
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        service: this.serviceName,
        ...context
      },
      error
    };

    // Console logging
    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Supabase logging (future implementation)
    if (this.enableSupabase) {
      this.logToSupabase(logEntry);
    }
  }

  /**
   * 🖥️ Console logging
   */
  private logToConsole(entry: LogEntry): void {
    const { level, message, timestamp, context, error } = entry;
    
    // Format timestamp
    const timeStr = new Date(timestamp).toLocaleTimeString();
    
    // Format context
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    
    // Format error
    const errorStr = error ? ` | Error: ${error.message}` : '';

    // Create log line
    const logLine = `[${timeStr}] [${level.toUpperCase()}] [${this.serviceName}] ${message}${contextStr}${errorStr}`;

    // Log to appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logLine);
        break;
      case LogLevel.INFO:
        console.info(logLine);
        break;
      case LogLevel.WARN:
        console.warn(logLine);
        break;
      case LogLevel.ERROR:
        console.error(logLine);
        if (error) {
          console.error('Stack trace:', error.stack);
        }
        break;
    }
  }

  /**
   * 🗄️ Supabase logging (placeholder voor toekomstige implementatie)
   */
  private async logToSupabase(entry: LogEntry): Promise<void> {
    try {
      // TODO: Implement Supabase logging
      // This will store logs in the database for production monitoring
      console.debug('Supabase logging not yet implemented:', entry);
    } catch (error) {
      // Fallback to console if Supabase logging fails
      console.error('Failed to log to Supabase:', error);
      this.logToConsole(entry);
    }
  }

  /**
   * ✅ Check if should log at this level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * 🔒 Determine security severity
   */
  private determineSecuritySeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
    const criticalEvents = ['authentication_failure', 'authorization_violation', 'sql_injection_attempt'];
    const highEvents = ['rate_limit_exceeded', 'suspicious_activity', 'invalid_token'];
    const mediumEvents = ['login_attempt', 'password_change', 'permission_check'];
    
    if (criticalEvents.some(e => event.includes(e))) return 'critical';
    if (highEvents.some(e => event.includes(e))) return 'high';
    if (mediumEvents.some(e => event.includes(e))) return 'medium';
    
    return 'low';
  }

  /**
   * 🔧 Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    this.info(`Log level changed to ${level}`);
  }

  /**
   * 🔧 Enable/disable console logging
   */
  setConsoleLogging(enabled: boolean): void {
    this.enableConsole = enabled;
    this.info(`Console logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 🔧 Enable/disable Supabase logging
   */
  setSupabaseLogging(enabled: boolean): void {
    this.enableSupabase = enabled;
    this.info(`Supabase logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 🔧 Enable/disable performance logging
   */
  setPerformanceLogging(enabled: boolean): void {
    this.enablePerformance = enabled;
    this.info(`Performance logging ${enabled ? 'enabled' : 'disabled'}`);
  }
}

/**
 * 🏭 Logger Factory - Maak loggers voor verschillende services
 */
export class LoggerFactory {
  private static loggers = new Map<string, Logger>();

  /**
   * 🎯 Get or create logger for service
   */
  static getLogger(serviceName: string, options?: {
    logLevel?: LogLevel;
    enableConsole?: boolean;
    enableSupabase?: boolean;
    enablePerformance?: boolean;
  }): Logger {
    if (!this.loggers.has(serviceName)) {
      const logger = new Logger(serviceName, options?.logLevel, {
        enableConsole: options?.enableConsole,
        enableSupabase: options?.enableSupabase,
        enablePerformance: options?.enablePerformance
      });
      
      this.loggers.set(serviceName, logger);
    }

    return this.loggers.get(serviceName)!;
  }

  /**
   * 🔧 Configure all loggers
   */
  static configureAll(options: {
    logLevel?: LogLevel;
    enableConsole?: boolean;
    enableSupabase?: boolean;
    enablePerformance?: boolean;
  }): void {
    this.loggers.forEach(logger => {
      if (options.logLevel) logger.setLogLevel(options.logLevel);
      if (options.enableConsole !== undefined) logger.setConsoleLogging(options.enableConsole);
      if (options.enableSupabase !== undefined) logger.setSupabaseLogging(options.enableSupabase);
      if (options.enablePerformance !== undefined) logger.setPerformanceLogging(options.enablePerformance);
    });
  }

  /**
   * 🧹 Clear all loggers
   */
  static clearAll(): void {
    this.loggers.clear();
  }
}

/**
 * 📊 Performance Logger - Specialized logger voor performance tracking
 */
export class PerformanceLogger extends Logger {
  constructor(serviceName: string = 'PerformanceLogger') {
    super(serviceName, LogLevel.INFO, {
      enableConsole: true,
      enableSupabase: false,
      enablePerformance: true
    });
  }

  /**
   * ⏱️ Time operation and log result
   */
  async timeOperation<T>(
    operation: string,
    operationFn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    const startMemory = this.getMemoryUsage();

    try {
      this.info(`Operation Started: ${operation}`, context);
      
      const result = await operationFn();
      
      const duration = Date.now() - startTime;
      const endMemory = this.getMemoryUsage();
      const memoryDelta = endMemory - startMemory;
      
      this.performance(operation, duration, context, memoryDelta);
      this.info(`Operation Completed: ${operation}`, {
        ...context,
        duration,
        memoryDelta
      });
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const endMemory = this.getMemoryUsage();
      const memoryDelta = endMemory - startMemory;
      
      this.error(`Operation Failed: ${operation}`, error as Error, {
        ...context,
        duration,
        memoryDelta
      });
      
      throw error;
    }
  }

  /**
   * 💾 Get memory usage (if available)
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

// Export everything
export {
  Logger,
  LoggerFactory,
  PerformanceLogger,
  LogLevel,
  LogContext,
  LogEntry
};
