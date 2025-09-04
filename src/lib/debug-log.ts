/**
 * State of the Art Debugging Log System
 * Prevents recurring issues by tracking problems, solutions, and environment
 * Integrates with Supabase for persistent storage and analysis
 * Now enhanced with Sentry monitoring and CI/CD pipeline tracking
 */

import { supabaseService } from './supabase';

// Sentry integration (will be initialized if available)
let Sentry: any = null;
try {
  Sentry = require('@sentry/react');
} catch {
  // Sentry not available, continue without it
}

interface DebugLogEntry {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category:
    | 'build'
    | 'runtime'
    | 'api'
    | 'database'
    | 'dependency'
    | 'performance'
    | 'security'
    | 'ci-cd'
    | 'testing';
  title: string;
  description: string;
  error_message?: string;
  stack_trace?: string;
  solution?: string;
  steps_taken: string[];
  environment: {
    node_version: string;
    npm_version: string;
    package_versions: Record<string, string>;
    os: string;
    timestamp: string;
    ci_cd_info?: {
      pipeline_id?: string;
      branch?: string;
      commit_sha?: string;
      environment?: string;
    };
  };
  status: 'open' | 'resolved' | 'investigating' | 'closed';
  resolution_date?: string;
  tags: string[];
  related_issues?: string[];
  prevention_notes?: string;
  ci_cd_context?: {
    pipeline_id?: string;
    stage?: string;
    job_id?: string;
    workflow_run_id?: string;
  };
  test_context?: {
    framework?: string;
    test_id?: string;
    coverage?: number;
    duration?: number;
  };
}

class DebugLogger {
  private logs: DebugLogEntry[] = [];
  private isInitialized = false;
  private ciCdContext: any = null;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load existing logs from database
      await this.loadLogsFromDatabase();

      // Load from localStorage as fallback
      this.loadLogsFromLocalStorage();

      // Initialize CI/CD context if available
      this.initializeCICDContext();

      this.isInitialized = true;
      console.log(
        '🔍 Debug Logger initialized successfully with CI/CD integration'
      );
    } catch (error) {
      console.error('Failed to initialize debug logger:', error);
      // Continue without database connection
      this.isInitialized = true;
    }
  }

  private initializeCICDContext() {
    // Detect CI/CD environment
    const isCI = process.env.CI === 'true';
    if (isCI) {
      this.ciCdContext = {
        pipeline_id:
          process.env.GITHUB_RUN_ID || process.env.GITLAB_CI_PIPELINE_ID,
        branch: process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME,
        commit_sha: process.env.GITHUB_SHA || process.env.CI_COMMIT_SHA,
        environment: process.env.NODE_ENV || 'ci',
        workflow_run_id: process.env.GITHUB_RUN_ID,
        job_id: process.env.GITHUB_JOB || process.env.CI_JOB_ID,
      };
    }
  }

  private async loadLogsFromDatabase() {
    try {
      const { data, error } = await supabaseService.getDebugLogs('demo-user');
      if (error) throw error;

      if (data) {
        this.logs = data.map(log => ({
          ...log,
          environment:
            typeof log.environment === 'string'
              ? JSON.parse(log.environment)
              : log.environment,
          steps_taken:
            typeof log.steps_taken === 'string'
              ? JSON.parse(log.steps_taken)
              : log.steps_taken,
        }));
      }
    } catch (error) {
      console.warn('Could not load logs from database:', error);
    }
  }

  private loadLogsFromLocalStorage() {
    try {
      const stored = localStorage.getItem('debug-logs');
      if (stored) {
        const localLogs = JSON.parse(stored);
        this.logs = [...this.logs, ...localLogs];
      }
    } catch (error) {
      console.warn('Could not load logs from localStorage:', error);
    }
  }

  async logError(
    category: DebugLogEntry['category'],
    title: string,
    description: string,
    errorMessage?: string,
    solution?: string,
    stepsTaken: string[] = []
  ) {
    await this.initialize();

    const entry: DebugLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      severity: 'error',
      category,
      title,
      description,
      error_message: errorMessage,
      solution,
      steps_taken: stepsTaken,
      environment: await this.getEnvironmentInfo(),
      status: 'open',
      tags: this.generateTags(category, title),
      related_issues: this.findRelatedIssues(title, description),
      ci_cd_context: this.ciCdContext,
    };

    await this.saveLog(entry);

    // Integrate with Sentry if available
    if (Sentry && errorMessage) {
      Sentry.captureException(new Error(errorMessage), {
        tags: {
          category,
          title,
          ...(this.ciCdContext && {
            pipeline_id: this.ciCdContext.pipeline_id,
            branch: this.ciCdContext.branch,
          }),
        },
        extra: {
          description,
          environment: entry.environment,
          steps_taken: stepsTaken,
          solution,
        },
        level: 'error',
      });
    }

    console.error(`🚨 Debug Log: ${title}`, entry);
  }

  async logWarning(
    category: DebugLogEntry['category'],
    title: string,
    description: string,
    solution?: string,
    stepsTaken: string[] = []
  ) {
    await this.initialize();

    const entry: DebugLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      severity: 'warning',
      category,
      title,
      description,
      solution,
      steps_taken: stepsTaken,
      environment: await this.getEnvironmentInfo(),
      status: 'open',
      tags: this.generateTags(category, title),
      related_issues: this.findRelatedIssues(title, description),
      ci_cd_context: this.ciCdContext,
    };

    await this.saveLog(entry);

    // Integrate with Sentry if available
    if (Sentry) {
      Sentry.captureMessage(`Warning: ${title}`, {
        level: 'warning',
        tags: {
          category,
          ...(this.ciCdContext && {
            pipeline_id: this.ciCdContext.pipeline_id,
            branch: this.ciCdContext.branch,
          }),
        },
        extra: { description, solution, steps_taken: stepsTaken },
      });
    }

    console.warn(`⚠️ Debug Log: ${title}`, entry);
  }

  async logInfo(
    category: DebugLogEntry['category'],
    title: string,
    description: string,
    stepsTaken: string[] = []
  ) {
    await this.initialize();

    const entry: DebugLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      severity: 'info',
      category,
      title,
      description,
      steps_taken: stepsTaken,
      environment: await this.getEnvironmentInfo(),
      status: 'open',
      tags: this.generateTags(category, title),
      related_issues: this.findRelatedIssues(title, description),
      ci_cd_context: this.ciCdContext,
    };

    await this.saveLog(entry);

    // Add breadcrumb to Sentry if available
    if (Sentry) {
      Sentry.addBreadcrumb({
        category,
        message: title,
        level: 'info',
        data: { description, steps_taken: stepsTaken },
      });
    }

    console.info(`ℹ️ Debug Log: ${title}`, entry);
  }

  async resolveIssue(
    logId: string,
    solution: string,
    preventionNotes?: string
  ) {
    const log = this.logs.find(l => l.id === logId);
    if (!log) return;

    log.status = 'resolved';
    log.resolution_date = new Date().toISOString();
    log.solution = solution;
    log.prevention_notes = preventionNotes;

    await this.updateLogInDatabase(log);
    this.saveLogToLocalStorage();
  }

  async findSimilarIssues(
    title: string,
    description: string
  ): Promise<DebugLogEntry[]> {
    const keywords = this.extractKeywords(title + ' ' + description);
    return this.logs.filter(log =>
      keywords.some(
        keyword =>
          log.title.toLowerCase().includes(keyword) ||
          log.description.toLowerCase().includes(keyword)
      )
    );
  }

  async getUnresolvedIssues(): Promise<DebugLogEntry[]> {
    return this.logs.filter(log => log.status === 'open');
  }

  async getIssuesByCategory(
    category: DebugLogEntry['category']
  ): Promise<DebugLogEntry[]> {
    return this.logs.filter(log => log.category === category);
  }

  async getIssuesBySeverity(
    severity: DebugLogEntry['severity']
  ): Promise<DebugLogEntry[]> {
    return this.logs.filter(log => log.severity === severity);
  }

  private generateId(): string {
    return `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTags(category: string, title: string): string[] {
    const tags = [category];
    const keywords = this.extractKeywords(title);
    return [...tags, ...keywords];
  }

  private findRelatedIssues(title: string, description: string): string[] {
    const keywords = this.extractKeywords(title + ' ' + description);
    return this.logs
      .filter(log =>
        keywords.some(
          keyword =>
            log.title.toLowerCase().includes(keyword) ||
            log.description.toLowerCase().includes(keyword)
        )
      )
      .map(log => log.id);
  }

  private extractKeywords(text: string): string[] {
    const commonWords = [
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
    ];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 10);
  }

  private async getEnvironmentInfo() {
    return {
      node_version: process.version,
      npm_version: await this.getNpmVersion(),
      package_versions: {
        'lucide-react': '0.344.0',
        vite: '5.4.19',
        react: '18.3.1',
        typescript: '5.5.3',
        '@testing-library/react': '14.0.0',
        cypress: '13.0.0',
        '@playwright/test': '1.40.0',
        jest: '29.0.0',
      },
      os: process.platform,
      timestamp: new Date().toISOString(),
      ci_cd_info: this.ciCdContext
        ? {
            pipeline_id: this.ciCdContext.pipeline_id,
            branch: this.ciCdContext.branch,
            commit_sha: this.ciCdContext.commit_sha,
            environment: this.ciCdContext.environment,
          }
        : undefined,
    };
  }

  private async getNpmVersion(): Promise<string> {
    try {
      const { execSync } = await import('child_process');
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  private async saveLog(entry: DebugLogEntry) {
    this.logs.push(entry);
    await this.saveLogToDatabase(entry);
    this.saveLogToLocalStorage();
  }

  private async saveLogToDatabase(entry: DebugLogEntry) {
    try {
      await supabaseService.createDebugLog({
        log_id: entry.id,
        timestamp: entry.timestamp,
        severity: entry.severity,
        category: entry.category,
        title: entry.title,
        description: entry.description,
        error_message: entry.error_message,
        solution: entry.solution,
        steps_taken: entry.steps_taken,
        environment: entry.environment,
        status: entry.status,
        resolution_date: entry.resolution_date,
        tags: entry.tags,
        related_issues: entry.related_issues,
        prevention_notes: entry.prevention_notes,
        user_id: 'demo-user',
      });
    } catch (error) {
      console.warn('Could not save log to database:', error);
    }
  }

  private async updateLogInDatabase(entry: DebugLogEntry) {
    try {
      await supabaseService.updateDebugLog(entry.id, {
        status: entry.status,
        resolution_date: entry.resolution_date,
        solution: entry.solution,
        prevention_notes: entry.prevention_notes,
      });
    } catch (error) {
      console.warn('Could not update log in database:', error);
    }
  }

  private saveLogToLocalStorage() {
    try {
      localStorage.setItem('debug-logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('Could not save logs to localStorage:', error);
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  cleanupOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.logs = this.logs.filter(
      log => new Date(log.timestamp) > thirtyDaysAgo
    );

    this.saveLogToLocalStorage();
  }

  // New method for CI/CD pipeline logging
  async logCICDEvent(
    stage: string,
    status: 'started' | 'success' | 'failed' | 'cancelled',
    description: string,
    metadata?: any
  ) {
    const severity =
      status === 'failed'
        ? 'error'
        : status === 'cancelled'
          ? 'warning'
          : 'info';

    await this.logInfo('ci-cd', `CI/CD ${stage} ${status}`, description, [
      `Stage: ${stage}`,
      `Status: ${status}`,
      ...(metadata ? [JSON.stringify(metadata)] : []),
    ]);

    // Track in Supabase CI/CD pipelines table
    if (this.ciCdContext?.pipeline_id) {
      try {
        await supabaseService.createCICDPipeline({
          pipeline_id: this.ciCdContext.pipeline_id,
          name: `${stage} - ${status}`,
          type: 'github-actions',
          status:
            status === 'started'
              ? 'running'
              : status === 'success'
                ? 'success'
                : 'failed',
          branch: this.ciCdContext.branch || 'unknown',
          commit_sha: this.ciCdContext.commit_sha || 'unknown',
          stages: [stage],
          metadata,
          user_id: 'demo-user',
        });
      } catch (error) {
        console.warn('Could not save CI/CD pipeline to database:', error);
      }
    }
  }

  // New method for test result logging
  async logTestResult(
    framework: 'jest' | 'cypress' | 'playwright',
    status: 'passed' | 'failed' | 'skipped',
    totalTests: number,
    passedTests: number,
    failedTests: number,
    skippedTests: number,
    duration: number,
    coverage?: number,
    metadata?: any
  ) {
    const severity =
      status === 'failed' ? 'error' : status === 'skipped' ? 'warning' : 'info';

    await this.logInfo(
      'testing',
      `${framework} tests ${status}`,
      `${passedTests}/${totalTests} tests passed in ${duration}ms`,
      [
        `Framework: ${framework}`,
        `Total: ${totalTests}`,
        `Passed: ${passedTests}`,
        `Failed: ${failedTests}`,
        `Skipped: ${skippedTests}`,
        `Duration: ${duration}ms`,
        ...(coverage ? [`Coverage: ${coverage}%`] : []),
        ...(metadata ? [JSON.stringify(metadata)] : []),
      ]
    );

    // Track in Supabase test results table
    try {
      await supabaseService.createTestResult({
        test_id: `test-${Date.now()}`,
        framework,
        status,
        duration,
        coverage,
        total_tests: totalTests,
        passed_tests: passedTests,
        failed_tests: failedTests,
        skipped_tests: skippedTests,
        metadata,
        user_id: 'demo-user',
      });
    } catch (error) {
      console.warn('Could not save test result to database:', error);
    }
  }

  // New method for performance monitoring
  async logPerformanceMetric(
    type: 'lighthouse' | 'webpagetest' | 'custom',
    score: number,
    metrics: Record<string, number>,
    url: string,
    metadata?: any
  ) {
    await this.logInfo(
      'performance',
      `${type} performance score: ${score}`,
      `Performance metrics for ${url}`,
      [
        `Type: ${type}`,
        `Score: ${score}`,
        `URL: ${url}`,
        ...Object.entries(metrics).map(([key, value]) => `${key}: ${value}`),
        ...(metadata ? [JSON.stringify(metadata)] : []),
      ]
    );

    // Track in Supabase performance metrics table
    try {
      await supabaseService.createPerformanceMetric({
        metric_id: `perf-${Date.now()}`,
        type,
        score,
        metrics,
        url,
        metadata,
        user_id: 'demo-user',
      });
    } catch (error) {
      console.warn('Could not save performance metric to database:', error);
    }
  }

  // New method for security scan logging
  async logSecurityScan(
    type: 'trivy' | 'npm-audit' | 'snyk',
    status: 'clean' | 'vulnerabilities' | 'error',
    vulnerabilities: any[],
    severityCounts: Record<string, number>,
    metadata?: any
  ) {
    const severity =
      status === 'vulnerabilities'
        ? 'error'
        : status === 'error'
          ? 'error'
          : 'info';

    await this.logInfo(
      'security',
      `${type} security scan: ${status}`,
      `Security scan completed with ${vulnerabilities.length} vulnerabilities`,
      [
        `Type: ${type}`,
        `Status: ${status}`,
        `Vulnerabilities: ${vulnerabilities.length}`,
        ...Object.entries(severityCounts).map(
          ([severity, count]) => `${severity}: ${count}`
        ),
        ...(metadata ? [JSON.stringify(metadata)] : []),
      ]
    );

    // Track in Supabase security scans table
    try {
      await supabaseService.createSecurityScan({
        scan_id: `scan-${Date.now()}`,
        type,
        status,
        vulnerabilities,
        severity_counts: severityCounts,
        metadata,
        user_id: 'demo-user',
      });
    } catch (error) {
      console.warn('Could not save security scan to database:', error);
    }
  }
}

export const debugLogger = new DebugLogger();

// Auto-initialize
debugLogger.initialize().catch(console.error);
