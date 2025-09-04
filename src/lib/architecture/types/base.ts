/**
 * 🏗️ Base Interfaces voor Gelaagde Architectuur
 * 
 * Deze interfaces definiëren de contracten voor alle lagen
 * volgens de AI Workflow Guide - Supabase Workflow Fundamentals
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// CONTROLLER LAYER INTERFACES
// ============================================================================

export interface IController<T, R = T> {
  handle(request: Request<T>): Promise<ApiResponse<R>>;
  validate?(data: unknown): data is T;
}

export interface Request<T = unknown> {
  data?: T;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  user?: UserContext;
}

export interface UserContext {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

// ============================================================================
// SERVICE LAYER INTERFACES
// ============================================================================

export interface IService<T, R = T> {
  execute(data: T): Promise<R>;
  validate?(data: unknown): data is T;
}

export interface IWorkflowService<T, R = T> extends IService<T, R> {
  executeWithWorkflow(data: T, workflow: WorkflowConfig): Promise<WorkflowResult<R>>;
  getWorkflowStatus(workflowId: string): Promise<WorkflowStatus>;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  steps: WorkflowStep[];
  retryPolicy?: RetryPolicy;
  timeout?: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  action: string;
  dependencies?: string[];
  retryCount?: number;
  maxRetries?: number;
}

export interface WorkflowResult<T> {
  success: boolean;
  data?: T;
  workflowId: string;
  steps: WorkflowStepResult[];
  totalDuration: number;
}

export interface WorkflowStepResult {
  stepId: string;
  success: boolean;
  duration: number;
  error?: string;
  retryCount: number;
}

export interface WorkflowStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep?: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

// ============================================================================
// REPOSITORY LAYER INTERFACES
// ============================================================================

export interface IRepository<T extends BaseEntity> {
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  read(id: string): Promise<T | null>;
  readMany(filters?: QueryFilters): Promise<T[]>;
  update(id: string, data: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  count(filters?: QueryFilters): Promise<number>;
}

export interface QueryFilters {
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
  include?: string[];
}

export interface ITransactionRepository<T extends BaseEntity> extends IRepository<T> {
  beginTransaction(): Promise<Transaction>;
  commit(transaction: Transaction): Promise<void>;
  rollback(transaction: Transaction): Promise<void>;
}

export interface Transaction {
  id: string;
  status: 'active' | 'committed' | 'rolled_back';
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

export interface ILogger {
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
}

export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

export interface IValidator<T> {
  validate(data: unknown): ValidationResult<T>;
  validatePartial(data: unknown): ValidationResult<Partial<T>>;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  supabase: SupabaseConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  features: FeatureFlags;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  storage: StorageConfig;
  realtime: RealtimeConfig;
}

export interface StorageConfig {
  bucket: string;
  publicUrl: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
}

export interface RealtimeConfig {
  enabled: boolean;
  channels: string[];
}

export interface SecurityConfig {
  jwtSecret: string;
  bcryptRounds: number;
  rateLimit: RateLimitConfig;
  cors: CorsConfig;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
}

export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

export interface MonitoringConfig {
  sentry: SentryConfig;
  posthog: PosthogConfig;
  logflare: LogflareConfig;
}

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
}

export interface PosthogConfig {
  apiKey: string;
  host: string;
  capturePageview: boolean;
}

export interface LogflareConfig {
  apiKey: string;
  sourceId: string;
  endpoint: string;
}

export interface FeatureFlags {
  pwa: boolean;
  offline: boolean;
  realtime: boolean;
  analytics: boolean;
  internationalization: boolean;
}

// ============================================================================
// EXPORT ALL INTERFACES
// ============================================================================

export type {
  BaseEntity,
  ApiResponse,
  PaginatedResponse,
  IController,
  Request,
  UserContext,
  IService,
  IWorkflowService,
  WorkflowConfig,
  WorkflowStep,
  WorkflowResult,
  WorkflowStepResult,
  WorkflowStatus,
  RetryPolicy,
  IRepository,
  QueryFilters,
  ITransactionRepository,
  Transaction,
  ILogger,
  ICache,
  IValidator,
  ValidationResult,
  ValidationError,
  AppConfig,
  SupabaseConfig,
  StorageConfig,
  RealtimeConfig,
  SecurityConfig,
  RateLimitConfig,
  CorsConfig,
  MonitoringConfig,
  SentryConfig,
  PosthogConfig,
  LogflareConfig,
  FeatureFlags,
};
