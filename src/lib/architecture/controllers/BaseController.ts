/**
 * 🎮 Base Controller - Foundation voor alle controllers
 * 
 * Implementeert de basis functionaliteit voor alle controllers
 * volgens de AI Workflow Guide - Supabase Workflow Fundamentals
 */

import { IController, Request, ApiResponse, UserContext } from '../types/base';
import { ILogger } from '../types/base';

export abstract class BaseController<T, R = T> implements IController<T, R> {
  protected logger: ILogger;
  protected controllerName: string;

  constructor(logger: ILogger, controllerName: string) {
    this.logger = logger;
    this.controllerName = controllerName;
  }

  /**
   * 🎯 Hoofd methode voor het afhandelen van requests
   */
  async handle(request: Request<T>): Promise<ApiResponse<R>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      this.logger.info(`[${this.controllerName}] Request started`, {
        requestId,
        controller: this.controllerName,
        timestamp: new Date().toISOString(),
        user: request.user?.id || 'anonymous',
        hasData: !!request.data,
        params: request.params,
        query: request.query
      });

      // 1. Valideer input
      if (request.data && this.validate) {
        const validationResult = this.validate(request.data);
        if (!validationResult) {
          return this.createErrorResponse(
            'VALIDATION_ERROR',
            'Invalid input data',
            400,
            requestId
          );
        }
      }

      // 2. Authenticatie check
      const authResult = await this.authenticate(request);
      if (!authResult.success) {
        return this.createErrorResponse(
          'AUTHENTICATION_ERROR',
          authResult.error || 'Authentication failed',
          401,
          requestId
        );
      }

      // 3. Autorizatie check
      const authzResult = await this.authorize(request, authResult.user);
      if (!authzResult.success) {
        return this.createErrorResponse(
          'AUTHORIZATION_ERROR',
          authzResult.error || 'Insufficient permissions',
          403,
          requestId
        );
      }

      // 4. Execute business logic
      const result = await this.execute(request);

      // 5. Log success
      const duration = Date.now() - startTime;
      this.logger.info(`[${this.controllerName}] Request completed successfully`, {
        requestId,
        controller: this.controllerName,
        duration,
        timestamp: new Date().toISOString(),
        user: request.user?.id || 'anonymous'
      });

      return this.createSuccessResponse(result, requestId);

    } catch (error) {
      // 6. Error handling
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error(`[${this.controllerName}] Request failed`, error, {
        requestId,
        controller: this.controllerName,
        duration,
        timestamp: new Date().toISOString(),
        user: request.user?.id || 'anonymous',
        error: errorMessage
      });

      return this.createErrorResponse(
        'EXECUTION_ERROR',
        errorMessage,
        500,
        requestId
      );
    }
  }

  /**
   * 🔐 Authenticatie check - moet geïmplementeerd worden door subclasses
   */
  protected abstract authenticate(request: Request<T>): Promise<{
    success: boolean;
    user?: UserContext;
    error?: string;
  }>;

  /**
   * 🚫 Autorizatie check - moet geïmplementeerd worden door subclasses
   */
  protected abstract authorize(
    request: Request<T>, 
    user: UserContext
  ): Promise<{
    success: boolean;
    error?: string;
  }>;

  /**
   * ⚡ Execute business logic - moet geïmplementeerd worden door subclasses
   */
  protected abstract execute(request: Request<T>): Promise<R>;

  /**
   * ✅ Valideer input data - optioneel, kan geïmplementeerd worden door subclasses
   */
  validate?(data: unknown): data is T;

  /**
   * 🆔 Genereer unieke request ID
   */
  private generateRequestId(): string {
    return `${this.controllerName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * ✅ Maak success response
   */
  protected createSuccessResponse(data: R, requestId: string): ApiResponse<R> {
    return {
      success: true,
      data,
      message: 'Operation completed successfully',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * ❌ Maak error response
   */
  protected createErrorResponse(
    code: string,
    message: string,
    statusCode: number,
    requestId: string
  ): ApiResponse<R> {
    return {
      success: false,
      error: `${code}: ${message}`,
      message: `Request ${requestId} failed`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🔍 Log request details voor debugging
   */
  protected logRequestDetails(request: Request<T>, requestId: string): void {
    this.logger.debug(`[${this.controllerName}] Request details`, {
      requestId,
      controller: this.controllerName,
      timestamp: new Date().toISOString(),
      user: request.user?.id || 'anonymous',
      data: request.data,
      params: request.params,
      query: request.query,
      headers: request.headers
    });
  }

  /**
   * 📊 Log performance metrics
   */
  protected logPerformanceMetrics(
    operation: string,
    duration: number,
    requestId: string,
    additionalData?: Record<string, any>
  ): void {
    this.logger.info(`[${this.controllerName}] Performance metric`, {
      requestId,
      controller: this.controllerName,
      operation,
      duration,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }

  /**
   * 🚨 Log security events
   */
  protected logSecurityEvent(
    event: string,
    details: Record<string, any>,
    requestId: string
  ): void {
    this.logger.warn(`[${this.controllerName}] Security event`, {
      requestId,
      controller: this.controllerName,
      event,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 🎯 Concrete controller voor AI Insights
 */
export class AIInsightsController extends BaseController<any, any> {
  constructor(logger: ILogger) {
    super(logger, 'AIInsightsController');
  }

  protected async authenticate(request: Request<any>): Promise<{
    success: boolean;
    user?: UserContext;
    error?: string;
  }> {
    // Voor nu: accepteer alle requests (kan later uitgebreid worden)
    return { success: true, user: request.user };
  }

  protected async authorize(
    request: Request<any>, 
    user: UserContext
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Voor nu: accepteer alle requests (kan later uitgebreid worden)
    return { success: true };
  }

  protected async execute(request: Request<any>): Promise<any> {
    // Implementatie wordt later toegevoegd
    return { message: 'AI Insights controller executed' };
  }
}

/**
 * 🎯 Concrete controller voor Workflow Management
 */
export class WorkflowController extends BaseController<any, any> {
  constructor(logger: ILogger) {
    super(logger, 'WorkflowController');
  }

  protected async authenticate(request: Request<any>): Promise<{
    success: boolean;
    user?: UserContext;
    error?: string;
  }> {
    // Voor nu: accepteer alle requests (kan later uitgebreid worden)
    return { success: true, user: request.user };
  }

  protected async authorize(
    request: Request<any>, 
    user: UserContext
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    // Voor nu: accepteer alle requests (kan later uitgebreid worden)
    return { success: true };
  }

  protected async execute(request: Request<any>): Promise<any> {
    // Implementatie wordt later toegevoegd
    return { message: 'Workflow controller executed' };
  }
}
