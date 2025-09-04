// Security Manager voor MyMindVentures.io
// Beheert security headers, data validatie en security best practices

import helmet from 'helmet';
import { z } from 'zod';
import * as yup from 'yup';

// Security configuratie interfaces
export interface SecurityConfig {
  helmet: {
    contentSecurityPolicy: boolean;
    hsts: boolean;
    noSniff: boolean;
    xssFilter: boolean;
    frameguard: boolean;
  };
  validation: {
    strictMode: boolean;
    maxStringLength: number;
    maxArrayLength: number;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
}

// Data validatie schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin', 'developer']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const AIInsightSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(10),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const AIWorkflowSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  steps: z.array(z.object({
    order: z.number().int().min(1),
    action: z.string().min(1).max(100),
    parameters: z.record(z.any()).optional()
  })).min(1).max(20),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Yup schemas voor backward compatibility
export const UserYupSchema = yup.object({
  id: yup.string().uuid().required(),
  email: yup.string().email().required(),
  name: yup.string().min(1).max(100).required(),
  role: yup.string().oneOf(['user', 'admin', 'developer']).required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required()
});

export const AIInsightYupSchema = yup.object({
  id: yup.string().uuid().optional(),
  title: yup.string().min(1).max(200).required(),
  content: yup.string().min(1).max(10000).required(),
  category: yup.string().min(1).max(50).required(),
  tags: yup.array(yup.string().max(30)).max(10).required(),
  metadata: yup.object().optional(),
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional()
});

export class SecurityManager {
  private config: SecurityConfig;
  private helmetMiddleware: any;

  constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      helmet: {
        contentSecurityPolicy: true,
        hsts: true,
        noSniff: true,
        xssFilter: true,
        frameguard: true
      },
      validation: {
        strictMode: true,
        maxStringLength: 10000,
        maxArrayLength: 100
      },
      rateLimit: {
        enabled: true,
        windowMs: 15 * 60 * 1000, // 15 minuten
        maxRequests: 100
      },
      ...config
    };

    this.initializeHelmet();
  }

  /**
   * Initialiseer Helmet middleware
   */
  private initializeHelmet(): void {
    const helmetOptions: any = {};

    if (this.config.helmet.contentSecurityPolicy) {
      helmetOptions.contentSecurityPolicy = {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'", "https://api.supabase.co", "https://*.openai.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      };
    }

    if (this.config.helmet.hsts) {
      helmetOptions.hsts = {
        maxAge: 31536000, // 1 jaar
        includeSubDomains: true,
        preload: true
      };
    }

    this.helmetMiddleware = helmet(helmetOptions);
  }

  /**
   * Krijg Helmet middleware
   */
  getHelmetMiddleware(): any {
    return this.helmetMiddleware;
  }

  /**
   * Valideer data met Zod schema
   */
  validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return { success: false, error: errorMessage };
      }
      return { success: false, error: 'Validation failed' };
    }
  }

  /**
   * Valideer data met Yup schema
   */
  async validateWithYup<T>(schema: yup.Schema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> {
    try {
      const result = await schema.validate(data, { abortEarly: false });
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errorMessage = error.errors.join(', ');
        return { success: false, error: errorMessage };
      }
      return { success: false, error: 'Validation failed' };
    }
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Verwijder < en >
      .replace(/javascript:/gi, '') // Verwijder javascript: links
      .replace(/on\w+=/gi, '') // Verwijder event handlers
      .trim();
  }

  /**
   * Valideer email adres
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valideer URL
   */
  validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Genereer secure random string
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Hash password (simpele implementatie - gebruik bcrypt in productie)
   */
  async hashPassword(password: string): Promise<string> {
    // In productie zou je bcrypt gebruiken
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verifieer password hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password);
    return hashedPassword === hash;
  }

  /**
   * Check of string XSS bevat
   */
  containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check of string SQL injection bevat
   */
  containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(\b(and|or)\b\s+\d+\s*=\s*\d+)/gi,
      /(\b(and|or)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi,
      /(--|\/\*|\*\/)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Update security configuratie
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeHelmet();
  }

  /**
   * Krijg huidige security configuratie
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Log security event
   */
  logSecurityEvent(event: string, details: any): void {
    console.warn(`🔒 SECURITY EVENT: ${event}`, {
      timestamp: new Date().toISOString(),
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Export utility functions
export const validateInput = (input: string): string => securityManager.sanitizeInput(input);
export const validateEmailFormat = (email: string): boolean => securityManager.validateEmail(email);
export const validateURLFormat = (url: string): boolean => securityManager.validateURL(url);
export const checkXSS = (input: string): boolean => securityManager.containsXSS(input);
export const checkSQLInjection = (input: string): boolean => securityManager.containsSQLInjection(input);
