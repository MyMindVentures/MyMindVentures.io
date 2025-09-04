import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityManager } from '../SecurityManager';

// Mock helmet
vi.mock('helmet', () => ({
  default: vi.fn(() => 'helmet-middleware')
}));

describe('SecurityManager', () => {
  let securityManager: SecurityManager;

  beforeEach(() => {
    securityManager = new SecurityManager();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const config = securityManager.getConfig();
      expect(config.enableHelmet).toBe(true);
      expect(config.enableValidation).toBe(true);
      expect(config.enableSanitization).toBe(true);
    });

    it('should initialize with custom config', () => {
      const customConfig = {
        enableHelmet: false,
        enableValidation: false,
        enableSanitization: false
      };
      const customManager = new SecurityManager(customConfig);
      const config = customManager.getConfig();
      expect(config.enableHelmet).toBe(false);
      expect(config.enableValidation).toBe(false);
      expect(config.enableSanitization).toBe(false);
    });
  });

  describe('Helmet middleware', () => {
    it('should return helmet middleware', () => {
      const middleware = securityManager.getHelmetMiddleware();
      expect(middleware).toBeDefined();
    });
  });

  describe('Zod validation', () => {
    it('should validate data with Zod schema', () => {
      const schema = { parse: vi.fn().mockReturnValue({ name: 'test', email: 'test@example.com' }) };
      const data = { name: 'test', email: 'test@example.com' };
      
      const result = securityManager.validateWithZod(schema as any, data);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('should handle Zod validation errors', () => {
      const schema = { 
        parse: vi.fn().mockImplementation(() => { 
          throw new Error('Validation failed'); 
        }) 
      };
      const data = { name: '', email: 'invalid-email' };
      
      const result = securityManager.validateWithZod(schema as any, data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
    });
  });

  describe('Yup validation', () => {
    it('should validate data with Yup schema', async () => {
      const schema = { 
        validate: vi.fn().mockResolvedValue({ name: 'test', email: 'test@example.com' }) 
      };
      const data = { name: 'test', email: 'test@example.com' };
      
      const result = await securityManager.validateWithYup(schema as any, data);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    it('should handle Yup validation errors', async () => {
      const schema = { 
        validate: vi.fn().mockRejectedValue(new Error('Validation failed')) 
      };
      const data = { name: '', email: 'invalid-email' };
      
      const result = await securityManager.validateWithYup(schema as any, data);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation failed');
    });
  });

  describe('Input sanitization', () => {
    it('should sanitize HTML input', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const sanitized = securityManager.sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello World');
    });

    it('should sanitize SQL injection attempts', () => {
      const input = "'; DROP TABLE users; --";
      const sanitized = securityManager.sanitizeInput(input);
      expect(sanitized).not.toContain('DROP TABLE');
    });
  });

  describe('Email validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];
      
      validEmails.forEach(email => {
        expect(securityManager.validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(securityManager.validateEmail(email)).toBe(false);
      });
    });
  });

  describe('URL validation', () => {
    it('should validate correct URL formats', () => {
      const validUrls = [
        'https://example.com',
        'http://subdomain.example.org',
        'https://example.com/path?param=value'
      ];
      
      validUrls.forEach(url => {
        expect(securityManager.validateURL(url)).toBe(true);
      });
    });

    it('should reject invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://invalid',
        'http://'
      ];
      
      invalidUrls.forEach(url => {
        expect(securityManager.validateURL(url)).toBe(false);
      });
    });
  });

  describe('Token generation', () => {
    it('should generate secure tokens', () => {
      const token1 = securityManager.generateSecureToken(16);
      const token2 = securityManager.generateSecureToken(32);
      
      expect(token1).toHaveLength(16);
      expect(token2).toHaveLength(32);
      expect(token1).not.toBe(token2);
    });
  });

  describe('Password operations', () => {
    it('should hash and verify passwords', async () => {
      const password = 'securePassword123';
      const hash = await securityManager.hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(await securityManager.verifyPassword(password, hash)).toBe(true);
      expect(await securityManager.verifyPassword('wrongPassword', hash)).toBe(false);
    });
  });

  describe('Security detection', () => {
    it('should detect XSS attempts', () => {
      const xssInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(\'xss\')">'
      ];
      
      xssInputs.forEach(input => {
        expect(securityManager.containsXSS(input)).toBe(true);
      });
    });

    it('should detect SQL injection attempts', () => {
      const sqlInputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--"
      ];
      
      sqlInputs.forEach(input => {
        expect(securityManager.containsSQLInjection(input)).toBe(true);
      });
    });

    it('should not flag safe inputs', () => {
      const safeInputs = [
        'Hello World',
        'user@example.com',
        'https://example.com'
      ];
      
      safeInputs.forEach(input => {
        expect(securityManager.containsXSS(input)).toBe(false);
        expect(securityManager.containsSQLInjection(input)).toBe(false);
      });
    });
  });

  describe('Configuration updates', () => {
    it('should update configuration', () => {
      const newConfig = { enableHelmet: false };
      securityManager.updateConfig(newConfig);
      
      const config = securityManager.getConfig();
      expect(config.enableHelmet).toBe(false);
    });
  });

  describe('Security logging', () => {
    it('should log security events', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      securityManager.logSecurityEvent('test_event', { user: 'test' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '🔒 Security Event: test_event',
        { user: 'test' }
      );
      
      consoleSpy.mockRestore();
    });
  });
});
