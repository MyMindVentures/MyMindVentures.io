/**
 * Rate Limiting Implementation
 * 
 * Provides DDoS protection and API rate limiting with:
 * - Token bucket algorithm
 * - Sliding window rate limiting
 * - IP-based and user-based limiting
 * - Configurable limits and windows
 * - Redis integration support
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  skipFailedRequests?: boolean; // Skip counting failed requests
  keyGenerator?: (req: any) => string; // Custom key generator
  handler?: (req: any, res: any) => void; // Custom handler for limit exceeded
  standardHeaders?: boolean; // Return rate limit info in headers
  legacyHeaders?: boolean; // Return rate limit info in legacy headers
  store?: RateLimitStore; // Custom store implementation
}

/**
 * Rate limit store interface
 */
export interface RateLimitStore {
  incr(key: string): Promise<{ totalHits: number; resetTime: Date }>;
  decrement(key: string): Promise<void>;
  resetKey(key: string): Promise<void>;
  resetAll(): Promise<void>;
}

/**
 * Rate limit info
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
  retryAfter: number;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  info: RateLimitInfo;
  retryAfter?: number;
}

/**
 * Memory store implementation
 */
export class MemoryStore implements RateLimitStore {
  private store: Map<string, { hits: number; resetTime: Date }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 60000) {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  async incr(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    const now = new Date();
    const entry = this.store.get(key);

    if (!entry || now >= entry.resetTime) {
      // Create new entry or reset expired entry
      const resetTime = new Date(now.getTime() + 60000); // 1 minute window
      this.store.set(key, { hits: 1, resetTime });
      return { totalHits: 1, resetTime };
    }

    // Increment existing entry
    entry.hits++;
    return { totalHits: entry.hits, resetTime: entry.resetTime };
  }

  async decrement(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry && entry.hits > 0) {
      entry.hits--;
    }
  }

  async resetKey(key: string): Promise<void> {
    this.store.delete(key);
  }

  async resetAll(): Promise<void> {
    this.store.clear();
  }

  private cleanup(): void {
    const now = new Date();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

/**
 * Token bucket rate limiter
 */
export class TokenBucketRateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number; capacity: number; refillRate: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request is allowed
   * @param key - Rate limit key
   * @returns Rate limit result
   */
  async isAllowed(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const bucket = this.buckets.get(key) || this.createBucket(key);

    // Refill tokens
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed * bucket.refillRate);
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // Check if request is allowed
    if (bucket.tokens >= 1) {
      bucket.tokens--;
      return {
        allowed: true,
        info: {
          limit: bucket.capacity,
          remaining: Math.floor(bucket.tokens),
          reset: new Date(now + (1 / bucket.refillRate) * 1000),
          retryAfter: 0
        }
      };
    }

    // Request blocked
    const retryAfter = Math.ceil((1 - bucket.tokens) / bucket.refillRate);
    return {
      allowed: false,
      info: {
        limit: bucket.capacity,
        remaining: 0,
        reset: new Date(now + retryAfter * 1000),
        retryAfter
      },
      retryAfter
    };
  }

  /**
   * Create new token bucket
   * @param key - Rate limit key
   * @returns Token bucket
   */
  private createBucket(key: string) {
    const bucket = {
      tokens: this.config.maxRequests,
      lastRefill: Date.now(),
      capacity: this.config.maxRequests,
      refillRate: this.config.maxRequests / (this.config.windowMs / 1000)
    };
    this.buckets.set(key, bucket);
    return bucket;
  }

  /**
   * Reset bucket for key
   * @param key - Rate limit key
   */
  resetBucket(key: string): void {
    this.buckets.delete(key);
  }

  /**
   * Get bucket info
   * @param key - Rate limit key
   * @returns Bucket info or null
   */
  getBucketInfo(key: string) {
    return this.buckets.get(key) || null;
  }
}

/**
 * Sliding window rate limiter
 */
export class SlidingWindowRateLimiter {
  private store: RateLimitStore;
  private config: RateLimitConfig;

  constructor(store: RateLimitStore, config: RateLimitConfig) {
    this.store = store;
    this.config = config;
  }

  /**
   * Check if request is allowed
   * @param key - Rate limit key
   * @returns Rate limit result
   */
  async isAllowed(key: string): Promise<RateLimitResult> {
    try {
      const { totalHits, resetTime } = await this.store.incr(key);
      const now = new Date();
      const remaining = Math.max(0, this.config.maxRequests - totalHits);
      const retryAfter = Math.max(0, Math.ceil((resetTime.getTime() - now.getTime()) / 1000));

      const allowed = totalHits <= this.config.maxRequests;

      return {
        allowed,
        info: {
          limit: this.config.maxRequests,
          remaining,
          reset: resetTime,
          retryAfter: allowed ? 0 : retryAfter
        },
        retryAfter: allowed ? undefined : retryAfter
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request on error (fail open)
      return {
        allowed: true,
        info: {
          limit: this.config.maxRequests,
          remaining: this.config.maxRequests - 1,
          reset: new Date(Date.now() + this.config.windowMs),
          retryAfter: 0
        }
      };
    }
  }

  /**
   * Decrement counter for key
   * @param key - Rate limit key
   */
  async decrement(key: string): Promise<void> {
    await this.store.decrement(key);
  }

  /**
   * Reset counter for key
   * @param key - Rate limit key
   */
  async reset(key: string): Promise<void> {
    await this.store.resetKey(key);
  }
}

/**
 * Rate limiting middleware
 */
export class RateLimitMiddleware {
  private limiter: SlidingWindowRateLimiter;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    const store = config.store || new MemoryStore();
    this.limiter = new SlidingWindowRateLimiter(store, config);
  }

  /**
   * Middleware function
   * @param req - Request object
   * @param res - Response object
   * @param next - Next function
   */
  async middleware(req: any, res: any, next: any): Promise<void> {
    try {
      const key = this.getKey(req);
      const result = await this.limiter.isAllowed(key);

      if (!result.allowed) {
        // Rate limit exceeded
        if (this.config.handler) {
          this.config.handler(req, res);
        } else {
          this.sendRateLimitResponse(res, result);
        }
        return;
      }

      // Add rate limit headers
      if (this.config.standardHeaders) {
        this.addRateLimitHeaders(res, result.info);
      }

      if (this.config.legacyHeaders) {
        this.addLegacyHeaders(res, result.info);
      }

      next();
    } catch (error) {
      console.error('Rate limiting middleware error:', error);
      // Allow request on error (fail open)
      next();
    }
  }

  /**
   * Get rate limit key for request
   * @param req - Request object
   * @returns Rate limit key
   */
  private getKey(req: any): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }

    // Default key generator
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const userId = req.user?.id || 'anonymous';
    return `${ip}:${userId}`;
  }

  /**
   * Send rate limit exceeded response
   * @param res - Response object
   * @param result - Rate limit result
   */
  private sendRateLimitResponse(res: any, result: RateLimitResult): void {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded',
      retryAfter: result.retryAfter,
      limit: result.info.limit,
      reset: result.info.reset
    });
  }

  /**
   * Add standard rate limit headers
   * @param res - Response object
   * @param info - Rate limit info
   */
  private addRateLimitHeaders(res: any, info: RateLimitInfo): void {
    res.set('X-RateLimit-Limit', info.limit.toString());
    res.set('X-RateLimit-Remaining', info.remaining.toString());
    res.set('X-RateLimit-Reset', Math.floor(info.reset.getTime() / 1000).toString());
  }

  /**
   * Add legacy rate limit headers
   * @param res - Response object
   * @param info - Rate limit info
   */
  private addLegacyHeaders(res: any, info: RateLimitInfo): void {
    res.set('X-RateLimit-Limit', info.limit.toString());
    res.set('X-RateLimit-Remaining', info.remaining.toString());
    res.set('X-RateLimit-Reset', Math.floor(info.reset.getTime() / 1000).toString());
  }

  /**
   * Get rate limit info for key
   * @param key - Rate limit key
   * @returns Rate limit info
   */
  async getInfo(key: string): Promise<RateLimitInfo | null> {
    try {
      const result = await this.limiter.isAllowed(key);
      return result.info;
    } catch (error) {
      console.error('Error getting rate limit info:', error);
      return null;
    }
  }

  /**
   * Reset rate limit for key
   * @param key - Rate limit key
   */
  async reset(key: string): Promise<void> {
    await this.limiter.reset(key);
  }
}

/**
 * Create rate limiting middleware
 * @param config - Rate limit configuration
 * @returns Rate limiting middleware
 */
export const createRateLimit = (config: RateLimitConfig) => {
  const middleware = new RateLimitMiddleware(config);
  return middleware.middleware.bind(middleware);
};

/**
 * Default rate limit configurations
 */
export const RateLimitPresets = {
  // Strict rate limiting
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    standardHeaders: true,
    legacyHeaders: false
  },

  // Standard rate limiting
  standard: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    standardHeaders: true,
    legacyHeaders: false
  },

  // Loose rate limiting
  loose: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10000,
    standardHeaders: true,
    legacyHeaders: false
  },

  // API rate limiting
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    standardHeaders: true,
    legacyHeaders: false
  },

  // Auth rate limiting
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    standardHeaders: true,
    legacyHeaders: false
  }
};

export default RateLimitMiddleware;
