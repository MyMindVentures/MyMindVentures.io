import { Logger } from '../logging/Logger';
import { UserEvent } from './MonitoringManager';

export interface AnalyticsConfig {
  enableTracking: boolean;
  enableDebug: boolean;
  sampleRate: number;
  respectPrivacy: boolean;
  anonymizeData: boolean;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface UserAction {
  action: string;
  element: string;
  path: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  properties?: Record<string, any>;
}

export interface ConversionGoal {
  name: string;
  value: number;
  currency?: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export class AnalyticsService {
  private config: AnalyticsConfig;
  private logger: Logger;
  private sessionId: string;
  private userId?: string;
  private pageViews: PageView[] = [];
  private userActions: UserAction[] = [];
  private conversionGoals: ConversionGoal[] = [];
  private isInitialized = false;

  constructor(config?: Partial<AnalyticsConfig>) {
    this.config = {
      enableTracking: true,
      enableDebug: false,
      sampleRate: 1.0,
      respectPrivacy: true,
      anonymizeData: false,
      ...config
    };
    
    this.logger = new Logger('AnalyticsService');
    this.sessionId = this.generateSessionId();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.info('Analytics already initialized');
      return;
    }

    try {
      if (this.config.enableTracking) {
        this.setupPageViewTracking();
        this.setupUserActionTracking();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        
        this.isInitialized = true;
        this.logger.info('Analytics initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize analytics', error);
      throw error;
    }
  }

  private setupPageViewTracking(): void {
    // Track page views
    this.trackPageView(window.location.pathname, document.title);
    
    // Track navigation changes
    if ('navigation' in window) {
      (window as any).navigation.addEventListener('navigate', (event: any) => {
        this.trackPageView(event.destination.url, event.destination.title);
      });
    }
  }

  private setupUserActionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.trackUserAction('click', target.tagName.toLowerCase(), {
          text: target.textContent?.slice(0, 100),
          className: target.className,
          id: target.id
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form) {
        this.trackUserAction('form_submit', form.tagName.toLowerCase(), {
          action: form.action,
          method: form.method,
          formId: form.id
        });
      }
    });

    // Track input changes
    document.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target && target.type !== 'password') {
        this.trackUserAction('input_change', target.tagName.toLowerCase(), {
          type: target.type,
          name: target.name,
          value: target.value.slice(0, 50)
        });
      }
    });
  }

  private setupPerformanceTracking(): void {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.trackPerformanceMetric('LCP', lastEntry.startTime, {
            type: 'core-web-vital',
            unit: 'ms'
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          
          entries.forEach((entry: any) => {
            this.trackPerformanceMetric('FID', entry.processingStart - entry.startTime, {
              type: 'core-web-vital',
              unit: 'ms'
            });
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          
          entryList.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.trackPerformanceMetric('CLS', clsValue, {
            type: 'core-web-vital',
            unit: 'score'
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        this.logger.warn('Failed to setup performance tracking', error);
      }
    }
  }

  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  trackPageView(path: string, title: string, referrer?: string): void {
    if (!this.config.enableTracking) return;

    const pageView: PageView = {
      path,
      title,
      referrer: referrer || document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.pageViews.push(pageView);
    
    // Keep only last 100 page views
    if (this.pageViews.length > 100) {
      this.pageViews = this.pageViews.slice(-100);
    }

    this.logger.debug('Page view tracked', pageView);
    
    // Send to analytics services
    this.sendPageView(pageView);
  }

  trackUserAction(action: string, element: string, properties?: Record<string, any>): void {
    if (!this.config.enableTracking) return;

    const userAction: UserAction = {
      action,
      element,
      path: window.location.pathname,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties
    };

    this.userActions.push(userAction);
    
    // Keep only last 1000 user actions
    if (this.userActions.length > 1000) {
      this.userActions = this.pageViews.slice(-1000);
    }

    this.logger.debug('User action tracked', userAction);
    
    // Send to analytics services
    this.sendUserAction(userAction);
  }

  trackPerformanceMetric(name: string, value: number, properties?: Record<string, any>): void {
    if (!this.config.enableTracking) return;

    const metric = {
      name,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties
    };

    this.logger.debug('Performance metric tracked', metric);
    
    // Send to analytics services
    this.sendPerformanceMetric(metric);
  }

  trackError(type: string, properties?: Record<string, any>): void {
    if (!this.config.enableTracking) return;

    const error = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties
    };

    this.logger.debug('Error tracked', error);
    
    // Send to analytics services
    this.sendError(error);
  }

  trackConversion(name: string, value: number, currency = 'USD', properties?: Record<string, any>): void {
    if (!this.config.enableTracking) return;

    const conversion: ConversionGoal = {
      name,
      value,
      currency,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.conversionGoals.push(conversion);
    
    // Keep only last 100 conversions
    if (this.conversionGoals.length > 100) {
      this.conversionGoals = this.conversionGoals.slice(-100);
    }

    this.logger.info('Conversion tracked', conversion);
    
    // Send to analytics services
    this.sendConversion(conversion);
  }

  setUser(userId: string, properties?: Record<string, any>): void {
    this.userId = this.config.anonymizeData ? this.hashUserId(userId) : userId;
    
    if (properties) {
      this.trackUserAction('user_identified', 'system', {
        userId: this.userId,
        properties
      });
    }

    this.logger.info('User set', { userId: this.userId });
  }

  clearUser(): void {
    this.userId = undefined;
    this.logger.info('User cleared');
  }

  private sendPageView(pageView: PageView): void {
    // Send to Posthog
    if (window.posthog) {
      try {
        window.posthog.capture('page_view', {
          path: pageView.path,
          title: pageView.title,
          referrer: pageView.referrer,
          session_id: pageView.sessionId,
          user_id: pageView.userId
        });
      } catch (error) {
        this.logger.warn('Failed to send page view to Posthog', error);
      }
    }
  }

  private sendUserAction(userAction: UserAction): void {
    // Send to Posthog
    if (window.posthog) {
      try {
        window.posthog.capture('user_action', {
          action: userAction.action,
          element: userAction.element,
          path: userAction.path,
          session_id: userAction.sessionId,
          user_id: userAction.userId,
          ...userAction.properties
        });
      } catch (error) {
        this.logger.warn('Failed to send user action to Posthog', error);
      }
    }
  }

  private sendPerformanceMetric(metric: any): void {
    // Send to Posthog
    if (window.posthog) {
      try {
        window.posthog.capture('performance_metric', {
          name: metric.name,
          value: metric.value,
          session_id: metric.sessionId,
          user_id: metric.userId,
          ...metric.properties
        });
      } catch (error) {
        this.logger.warn('Failed to send performance metric to Posthog', error);
      }
    }
  }

  private sendError(error: any): void {
    // Send to Posthog
    if (window.posthog) {
      try {
        window.posthog.capture('error', {
          type: error.type,
          session_id: error.sessionId,
          user_id: error.userId,
          ...error.properties
        });
      } catch (error) {
        this.logger.warn('Failed to send error to Posthog', error);
      }
    }
  }

  private sendConversion(conversion: ConversionGoal): void {
    // Send to Posthog
    if (window.posthog) {
      try {
        window.posthog.capture('conversion', {
          name: conversion.name,
          value: conversion.value,
          currency: conversion.currency,
          session_id: conversion.sessionId,
          user_id: conversion.userId,
          ...conversion.properties
        });
      } catch (error) {
        this.logger.warn('Failed to send conversion to Posthog', error);
      }
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private hashUserId(userId: string): string {
    // Simple hash function for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'user_' + Math.abs(hash);
  }

  getAnalytics(): {
    pageViews: PageView[];
    userActions: UserAction[];
    conversionGoals: ConversionGoal[];
    sessionId: string;
    userId?: string;
  } {
    return {
      pageViews: [...this.pageViews],
      userActions: [...this.userActions],
      conversionGoals: [...this.conversionGoals],
      sessionId: this.sessionId,
      userId: this.userId
    };
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.logger.info('Analytics config updated', this.config);
  }

  isInitialized(): boolean {
    return this.isInitialized;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getUserId(): string | undefined {
    return this.userId;
  }
}

export const analyticsService = new AnalyticsService();

// Extend Window interface for Posthog
declare global {
  interface Window {
    posthog?: any;
  }
}
