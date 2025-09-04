// Security Middleware voor MyMindVentures.io
// Express.js compatible middleware voor security

import { securityManager } from './SecurityManager';

export interface SecurityMiddlewareOptions {
  enableCORS?: boolean;
  enableRateLimit?: boolean;
  enableCompression?: boolean;
  enableHelmet?: boolean;
  corsOrigins?: string[];
  rateLimitWindow?: number;
  rateLimitMax?: number;
}

export class SecurityMiddleware {
  private options: SecurityMiddlewareOptions;

  constructor(options: SecurityMiddlewareOptions = {}) {
    this.options = {
      enableCORS: true,
      enableRateLimit: true,
      enableCompression: true,
      enableHelmet: true,
      corsOrigins: ['http://localhost:3000', 'https://mymindventures.io'],
      rateLimitWindow: 15 * 60 * 1000, // 15 minuten
      rateLimitMax: 100,
      ...options
    };
  }

  /**
   * CORS middleware
   */
  cors() {
    return (req: any, res: any, next: any) => {
      const origin = req.headers.origin;
      
      if (this.options.enableCORS && origin) {
        if (this.options.corsOrigins!.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
          res.setHeader('Access-Control-Allow-Origin', this.options.corsOrigins![0]);
        }
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      next();
    };
  }

  /**
   * Rate limiting middleware
   */
  rateLimit() {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: any, res: any, next: any) => {
      if (!this.options.enableRateLimit) {
        return next();
      }

      const clientId = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const windowStart = now - this.options.rateLimitWindow!;

      if (!requests.has(clientId)) {
        requests.set(clientId, { count: 1, resetTime: now + this.options.rateLimitWindow! });
      } else {
        const client = requests.get(clientId)!;
        
        if (now > client.resetTime) {
          client.count = 1;
          client.resetTime = now + this.options.rateLimitWindow!;
        } else {
          client.count++;
        }

        if (client.count > this.options.rateLimitMax!) {
          securityManager.logSecurityEvent('Rate limit exceeded', { clientId, count: client.count });
          return res.status(429).json({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: Math.ceil((client.resetTime - now) / 1000)
          });
        }
      }

      // Cleanup oude entries
      for (const [id, data] of requests.entries()) {
        if (now > data.resetTime) {
          requests.delete(id);
        }
      }

      next();
    };
  }

  /**
   * Input validation middleware
   */
  validateInput(fields: string[]) {
    return (req: any, res: any, next: any) => {
      const body = req.body || {};
      const query = req.query || {};
      const params = req.params || {};

      const allData = { ...body, ...query, ...params };
      let hasInvalidInput = false;
      const invalidFields: string[] = [];

      for (const field of fields) {
        if (allData[field] && typeof allData[field] === 'string') {
          const sanitized = securityManager.sanitizeInput(allData[field]);
          
          if (securityManager.containsXSS(sanitized)) {
            hasInvalidInput = true;
            invalidFields.push(`${field} (XSS detected)`);
          }
          
          if (securityManager.containsSQLInjection(sanitized)) {
            hasInvalidInput = true;
            invalidFields.push(`${field} (SQL injection detected)`);
          }

          // Update de data met gesanitizede versie
          if (body[field]) body[field] = sanitized;
          if (query[field]) query[field] = sanitized;
          if (params[field]) params[field] = sanitized;
        }
      }

      if (hasInvalidInput) {
        securityManager.logSecurityEvent('Invalid input detected', { invalidFields, clientIp: req.ip });
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Potentially dangerous input detected',
          invalidFields
        });
      }

      next();
    };
  }

  /**
   * Authentication middleware
   */
  requireAuth() {
    return (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      // Hier zou je JWT validatie implementeren
      // Voor nu doen we een simpele check
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid authorization header format'
        });
      }

      const token = authHeader.substring(7);
      
      // Simpele token validatie (in productie zou je JWT verify gebruiken)
      if (token.length < 10) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      }

      // Voeg user info toe aan request
      req.user = { id: 'user-id', token };
      next();
    };
  }

  /**
   * Role-based access control middleware
   */
  requireRole(roles: string[]) {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      // Hier zou je role checking implementeren
      // Voor nu doen we een simpele check
      const userRole = req.user.role || 'user';
      
      if (!roles.includes(userRole)) {
        securityManager.logSecurityEvent('Unauthorized role access', {
          user: req.user.id,
          requiredRoles: roles,
          userRole
        });

        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  }

  /**
   * Content type validation middleware
   */
  validateContentType(allowedTypes: string[]) {
    return (req: any, res: any, next: any) => {
      const contentType = req.headers['content-type'];
      
      if (!contentType) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Content-Type header required'
        });
      }

      const isValidType = allowedTypes.some(type => 
        contentType.includes(type)
      );

      if (!isValidType) {
        return res.status(415).json({
          error: 'Unsupported Media Type',
          message: `Content-Type must be one of: ${allowedTypes.join(', ')}`
        });
      }

      next();
    };
  }

  /**
   * Request size limiting middleware
   */
  limitRequestSize(maxSize: number = 1024 * 1024) { // 1MB default
    return (req: any, res: any, next: any) => {
      const contentLength = parseInt(req.headers['content-length'] || '0');
      
      if (contentLength > maxSize) {
        return res.status(413).json({
          error: 'Payload Too Large',
          message: `Request size exceeds maximum allowed size of ${maxSize} bytes`
        });
      }

      next();
    };
  }

  /**
   * Security headers middleware
   */
  securityHeaders() {
    return (req: any, res: any, next: any) => {
      // Basic security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      
      // Remove server information
      res.removeHeader('X-Powered-By');
      res.removeHeader('Server');

      next();
    };
  }

  /**
   * Logging middleware
   */
  requestLogging() {
    return (req: any, res: any, next: any) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress
        };

        if (res.statusCode >= 400) {
          console.warn('🚨 Request Error:', logData);
        } else {
          console.log('📝 Request Log:', logData);
        }
      });

      next();
    };
  }

  /**
   * Krijg alle middleware functies
   */
  getAllMiddleware() {
    return {
      cors: this.cors(),
      rateLimit: this.rateLimit(),
      securityHeaders: this.securityHeaders(),
      requestLogging: this.requestLogging(),
      validateInput: (fields: string[]) => this.validateInput(fields),
      requireAuth: this.requireAuth(),
      requireRole: (roles: string[]) => this.requireRole(roles),
      validateContentType: (types: string[]) => this.validateContentType(types),
      limitRequestSize: (size: number) => this.limitRequestSize(size)
    };
  }
}

// Export singleton instance
export const securityMiddleware = new SecurityMiddleware();
