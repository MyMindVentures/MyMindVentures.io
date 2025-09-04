/**
 * Lazy Loading Implementation
 * 
 * Provides code splitting and dynamic imports for better performance:
 * - Component lazy loading
 * - Route-based code splitting
 * - Dynamic imports with error boundaries
 * - Preloading strategies
 * - Bundle analysis integration
 */

import React, { ComponentType, lazy, Suspense, ReactNode } from 'react';

/**
 * Lazy loading configuration
 */
export interface LazyLoadingConfig {
  fallback?: ReactNode;
  errorBoundary?: ComponentType<any>;
  preloadStrategy?: 'idle' | 'hover' | 'visible' | 'manual';
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Lazy component wrapper with error handling
 */
export interface LazyComponentProps {
  fallback?: ReactNode;
  errorBoundary?: ComponentType<any>;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

/**
 * Lazy loading error boundary
 */
export class LazyLoadingErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Lazy loading error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="lazy-loading-error">
          <h3>Something went wrong</h3>
          <p>Failed to load component</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced lazy loading function with retry logic
 * @param importFn - Dynamic import function
 * @param config - Lazy loading configuration
 * @returns Lazy component
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: LazyLoadingConfig = {}
): React.LazyExoticComponent<T> {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    fallback,
    errorBoundary: ErrorBoundary = LazyLoadingErrorBoundary
  } = config;

  let retryCount = 0;

  const retryImport = async (): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (retryCount < retryAttempts) {
        retryCount++;
        console.warn(`Lazy loading failed, retrying (${retryCount}/${retryAttempts})...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
        
        return retryImport();
      }
      
      console.error('Lazy loading failed after all retry attempts:', error);
      throw error;
    }
  };

  return lazy(retryImport);
}

/**
 * Lazy component wrapper with error boundary
 * @param Component - Lazy component
 * @param props - Component props
 * @returns Wrapped component
 */
export function withLazyLoading<T extends ComponentType<any>>(
  Component: React.LazyExoticComponent<T>,
  props: LazyComponentProps = {}
): ReactNode {
  const { fallback, errorBoundary: ErrorBoundary = LazyLoadingErrorBoundary, onError, onLoad } = props;

  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Suspense fallback={fallback || <div>Loading...</div>}>
        <Component onLoad={onLoad} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Route-based lazy loading
 */
export class RouteLazyLoader {
  private routeComponents: Map<string, React.LazyExoticComponent<any>> = new Map();
  private preloadedRoutes: Set<string> = new Set();

  /**
   * Register a lazy route
   * @param route - Route path
   * @param importFn - Dynamic import function
   * @param config - Lazy loading configuration
   */
  registerRoute<T extends ComponentType<any>>(
    route: string,
    importFn: () => Promise<{ default: T }>,
    config: LazyLoadingConfig = {}
  ): void {
    this.routeComponents.set(route, createLazyComponent(importFn, config));
  }

  /**
   * Get lazy route component
   * @param route - Route path
   * @returns Lazy component or undefined
   */
  getRouteComponent(route: string): React.LazyExoticComponent<any> | undefined {
    return this.routeComponents.get(route);
  }

  /**
   * Preload route component
   * @param route - Route path
   * @param strategy - Preload strategy
   */
  async preloadRoute(route: string, strategy: 'idle' | 'hover' | 'visible' | 'manual' = 'idle'): Promise<void> {
    if (this.preloadedRoutes.has(route)) {
      return; // Already preloaded
    }

    const component = this.routeComponents.get(route);
    if (!component) {
      console.warn(`Route component not found: ${route}`);
      return;
    }

    try {
      switch (strategy) {
        case 'idle':
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.preloadComponent(component));
          } else {
            setTimeout(() => this.preloadComponent(component), 100);
          }
          break;
        
        case 'hover':
          // Preload on hover (implemented in component)
          break;
        
        case 'visible':
          // Preload when visible (implemented with Intersection Observer)
          break;
        
        case 'manual':
          await this.preloadComponent(component);
          break;
      }
    } catch (error) {
      console.error(`Failed to preload route: ${route}`, error);
    }
  }

  /**
   * Preload component
   * @param component - Lazy component
   */
  private async preloadComponent(component: React.LazyExoticComponent<any>): Promise<void> {
    try {
      // Trigger the import
      await component._init();
      console.log('Component preloaded successfully');
    } catch (error) {
      console.error('Component preload failed:', error);
    }
  }

  /**
   * Get all registered routes
   * @returns Array of route paths
   */
  getRegisteredRoutes(): string[] {
    return Array.from(this.routeComponents.keys());
  }

  /**
   * Get preload status
   * @returns Preload status object
   */
  getPreloadStatus(): { total: number; preloaded: number; pending: number } {
    const total = this.routeComponents.size;
    const preloaded = this.preloadedRoutes.size;
    const pending = total - preloaded;

    return { total, preloaded, pending };
  }
}

/**
 * Intersection Observer for lazy loading
 */
export class IntersectionObserverLazyLoader {
  private observer: IntersectionObserver;
  private elements: Map<Element, () => void> = new Map();

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }

  /**
   * Observe element for lazy loading
   * @param element - Element to observe
   * @param callback - Callback when element becomes visible
   */
  observe(element: Element, callback: () => void): void {
    this.elements.set(element, callback);
    this.observer.observe(element);
  }

  /**
   * Unobserve element
   * @param element - Element to unobserve
   */
  unobserve(element: Element): void {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }

  /**
   * Handle intersection
   * @param entries - Intersection observer entries
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const callback = this.elements.get(entry.target);
        if (callback) {
          callback();
          this.unobserve(entry.target);
        }
      }
    });
  }

  /**
   * Disconnect observer
   */
  disconnect(): void {
    this.observer.disconnect();
    this.elements.clear();
  }
}

/**
 * Bundle analyzer integration
 */
export class BundleAnalyzer {
  private bundleInfo: Map<string, { size: number; chunks: string[] }> = new Map();

  /**
   * Analyze bundle size
   * @param bundleName - Bundle name
   * @param size - Bundle size in bytes
   * @param chunks - Bundle chunks
   */
  analyzeBundle(bundleName: string, size: number, chunks: string[] = []): void {
    this.bundleInfo.set(bundleName, { size, chunks });
  }

  /**
   * Get bundle analysis report
   * @returns Bundle analysis report
   */
  getAnalysisReport(): any {
    const totalSize = Array.from(this.bundleInfo.values()).reduce((sum, info) => sum + info.size, 0);
    const totalChunks = Array.from(this.bundleInfo.values()).reduce((sum, info) => sum + info.chunks.length, 0);

    return {
      timestamp: new Date(),
      totalBundles: this.bundleInfo.size,
      totalSize,
      totalSizeKB: Math.round(totalSize / 1024),
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      totalChunks,
      bundles: Array.from(this.bundleInfo.entries()).map(([name, info]) => ({
        name,
        size: info.size,
        sizeKB: Math.round(info.size / 1024),
        sizeMB: Math.round(info.size / (1024 * 1024) * 100) / 100,
        chunks: info.chunks.length
      }))
    };
  }

  /**
   * Get bundle size recommendations
   * @returns Size recommendations
   */
  getSizeRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.getAnalysisReport();

    if (report.totalSizeMB > 2) {
      recommendations.push('Total bundle size is large (>2MB). Consider code splitting and tree shaking.');
    }

    if (report.totalBundles > 10) {
      recommendations.push('Many bundles detected. Consider consolidating related code.');
    }

    if (report.totalChunks > 50) {
      recommendations.push('High number of chunks. Consider adjusting chunk size limits.');
    }

    return recommendations;
  }
}

/**
 * Performance monitoring for lazy loading
 */
export class LazyLoadingPerformanceMonitor {
  private loadTimes: Map<string, number[]> = new Map();
  private errorCounts: Map<string, number> = new Map();

  /**
   * Record component load time
   * @param componentName - Component name
   * @param loadTime - Load time in milliseconds
   */
  recordLoadTime(componentName: string, loadTime: number): void {
    if (!this.loadTimes.has(componentName)) {
      this.loadTimes.set(componentName, []);
    }
    this.loadTimes.get(componentName)!.push(loadTime);
  }

  /**
   * Record component load error
   * @param componentName - Component name
   */
  recordError(componentName: string): void {
    const currentCount = this.errorCounts.get(componentName) || 0;
    this.errorCounts.set(componentName, currentCount + 1);
  }

  /**
   * Get performance report
   * @returns Performance report
   */
  getPerformanceReport(): any {
    const report: any = {
      timestamp: new Date(),
      components: {}
    };

    for (const [componentName, loadTimes] of this.loadTimes.entries()) {
      const avgLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
      const minLoadTime = Math.min(...loadTimes);
      const maxLoadTime = Math.max(...loadTimes);
      const errorCount = this.errorCounts.get(componentName) || 0;

      report.components[componentName] = {
        totalLoads: loadTimes.length,
        averageLoadTime: Math.round(avgLoadTime * 100) / 100,
        minLoadTime: Math.round(minLoadTime * 100) / 100,
        maxLoadTime: Math.round(maxLoadTime * 100) / 100,
        errorCount,
        successRate: Math.round(((loadTimes.length - errorCount) / loadTimes.length) * 100)
      };
    }

    return report;
  }

  /**
   * Get performance recommendations
   * @returns Performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const report = this.getPerformanceReport();

    for (const [componentName, stats] of Object.entries(report.components)) {
      const componentStats = stats as any;

      if (componentStats.averageLoadTime > 1000) {
        recommendations.push(`${componentName}: Average load time is high (>1s). Consider preloading or optimization.`);
      }

      if (componentStats.successRate < 95) {
        recommendations.push(`${componentName}: Success rate is low (<95%). Check for loading errors.`);
      }
    }

    return recommendations;
  }
}

// Export default instances
export const routeLazyLoader = new RouteLazyLoader();
export const bundleAnalyzer = new BundleAnalyzer();
export const performanceMonitor = new LazyLoadingPerformanceMonitor();

export default {
  createLazyComponent,
  withLazyLoading,
  RouteLazyLoader,
  IntersectionObserverLazyLoader,
  BundleAnalyzer,
  LazyLoadingPerformanceMonitor,
  routeLazyLoader,
  bundleAnalyzer,
  performanceMonitor
};
