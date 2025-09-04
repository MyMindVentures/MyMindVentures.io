import { Logger } from '../logging/Logger';

export interface MonitoringConfig {
  enableSentry: boolean;
  enablePosthog: boolean;
  enablePerformance: boolean;
  enableHealthChecks: boolean;
  environment: 'development' | 'staging' | 'production';
  sampleRate: number;
  tracesSampleRate: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface ErrorEvent {
  error: Error;
  context?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  tags?: Record<string, string>;
}

export interface UserEvent {
  event: string;
  properties?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  timestamp?: number;
}

export class MonitoringManager {
  private config: MonitoringConfig;
  private logger: Logger;
  private performanceMetrics: PerformanceMetric[] = [];
  private isInitialized = false;

  constructor(config?: Partial<MonitoringConfig>) {
    this.config = {
      enableSentry: true,
      enablePosthog: true,
      enablePerformance: true,
      enableHealthChecks: true,
      environment: 'development',
      sampleRate: 1.0,
      tracesSampleRate: 0.1,
      ...config
    };
    
    this.logger = new Logger('MonitoringManager');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.info('Monitoring already initialized');
      return;
    }

    try {
      if (this.config.enableSentry) {
        await this.initializeSentry();
      }

      if (this.config.enablePosthog) {
        await this.initializePosthog();
      }

      if (this.config.enablePerformance) {
        this.initializePerformanceMonitoring();
      }

      if (this.config.enableHealthChecks) {
        this.initializeHealthChecks();
      }

      this.isInitialized = true;
      this.logger.info('Monitoring initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize monitoring', error);
      throw error;
    }
  }

  private async initializeSentry(): Promise<void> {
    try {
      // Dynamic import to avoid bundling in development
      const Sentry = await import('@sentry/react');
      
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        environment: this.config.environment,
        sampleRate: this.config.sampleRate,
        tracesSampleRate: this.config.tracesSampleRate,
        integrations: [
          new Sentry.BrowserTracing(),
          new Sentry.Replay()
        ],
        beforeSend(event) {
          // Filter out development errors
          if (process.env.NODE_ENV === 'development') {
            return null;
          }
          return event;
        }
      });

      this.logger.info('Sentry initialized');
    } catch (error) {
      this.logger.warn('Sentry not available, skipping initialization');
    }
  }

  private async initializePosthog(): Promise<void> {
    try {
      // Dynamic import to avoid bundling in development
      const posthog = await import('posthog-js');
      
      posthog.init(process.env.REACT_APP_POSTHOG_KEY || '', {
        api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        }
      });

      this.logger.info('Posthog initialized');
    } catch (error) {
      this.logger.warn('Posthog not available, skipping initialization');
    }
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      this.observeCoreWebVitals();
      
      // Monitor custom performance metrics
      this.observeCustomMetrics();
      
      this.logger.info('Performance monitoring initialized');
    }
  }

  private observeCoreWebVitals(): void {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.recordPerformanceMetric({
            name: 'LCP',
            value: lastEntry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            tags: { type: 'core-web-vital' }
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        this.logger.warn('Failed to observe LCP', error);
      }
    }

    // FID (First Input Delay)
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          
          entries.forEach((entry) => {
            this.recordPerformanceMetric({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              unit: 'ms',
              timestamp: Date.now(),
              tags: { type: 'core-web-vital' }
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        this.logger.warn('Failed to observe FID', error);
      }
    }

    // CLS (Cumulative Layout Shift)
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          
          entryList.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.recordPerformanceMetric({
            name: 'CLS',
            value: clsValue,
            unit: 'score',
            timestamp: Date.now(),
            tags: { type: 'core-web-vital' }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        this.logger.warn('Failed to observe CLS', error);
      }
    }
  }

  private observeCustomMetrics(): void {
    // Monitor page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordPerformanceMetric({
          name: 'PageLoadTime',
          value: navigation.loadEventEnd - navigation.navigationStart,
          unit: 'ms',
          timestamp: Date.now(),
          tags: { type: 'custom' }
        });
      }
    });

    // Monitor resource loading
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry: any) => {
            if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
              this.recordPerformanceMetric({
                name: 'APIResponseTime',
                value: entry.responseEnd - entry.requestStart,
                unit: 'ms',
                timestamp: Date.now(),
                tags: { 
                  type: 'custom',
                  resource: entry.name,
                  initiator: entry.initiatorType
                }
              });
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        this.logger.warn('Failed to observe resource timing', error);
      }
    }
  }

  private initializeHealthChecks(): void {
    // Monitor application health
    setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds

    this.logger.info('Health checks initialized');
  }

  private performHealthCheck(): void {
    const healthMetrics = {
      memory: this.getMemoryUsage(),
      performance: this.getPerformanceMetrics(),
      errors: this.getErrorCount(),
      timestamp: Date.now()
    };

    this.logger.info('Health check performed', healthMetrics);
    
    // Send health metrics to monitoring services
    this.sendHealthMetrics(healthMetrics);
  }

  private getMemoryUsage(): Record<string, number> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)  // MB
      };
    }
    return {};
  }

  private getPerformanceMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    this.performanceMetrics.forEach(metric => {
      if (!metrics[metric.name]) {
        metrics[metric.name] = metric.value;
      }
    });
    
    return metrics;
  }

  private getErrorCount(): number {
    // This would be implemented with actual error tracking
    return 0;
  }

  private sendHealthMetrics(metrics: any): void {
    // Send to monitoring services
    if (this.config.enableSentry) {
      this.sendToSentry('health_check', metrics);
    }
    
    if (this.config.enablePosthog) {
      this.sendToPosthog('health_check', metrics);
    }
  }

  recordPerformanceMetric(metric: PerformanceMetric): void {
    this.performanceMetrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
    
    this.logger.debug('Performance metric recorded', metric);
  }

  captureError(error: Error, context?: Record<string, any>): void {
    const errorEvent: ErrorEvent = {
      error,
      context,
      timestamp: Date.now()
    };

    this.logger.error('Error captured', errorEvent);

    if (this.config.enableSentry) {
      this.sendToSentry('error', errorEvent);
    }
  }

  captureEvent(event: UserEvent): void {
    this.logger.info('Event captured', event);

    if (this.config.enablePosthog) {
      this.sendToPosthog('event', event);
    }
  }

  private sendToSentry(type: string, data: any): void {
    try {
      // This would be implemented with actual Sentry SDK
      this.logger.debug('Data sent to Sentry', { type, data });
    } catch (error) {
      this.logger.warn('Failed to send data to Sentry', error);
    }
  }

  private sendToPosthog(type: string, data: any): void {
    try {
      // This would be implemented with actual Posthog SDK
      this.logger.debug('Data sent to Posthog', { type, data });
    } catch (error) {
      this.logger.warn('Failed to send data to Posthog', error);
    }
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Monitoring config updated', this.config);
  }

  isHealthy(): boolean {
    // Basic health check
    return this.isInitialized && this.performanceMetrics.length > 0;
  }

  getHealthReport(): Record<string, any> {
    return {
      isInitialized: this.isInitialized,
      config: this.config,
      performanceMetrics: this.performanceMetrics.length,
      isHealthy: this.isHealthy(),
      timestamp: Date.now()
    };
  }
}

export const monitoringManager = new MonitoringManager();
