// Security Utilities voor MyMindVentures.io
// Helper functies voor security operaties

import { securityManager } from './SecurityManager';

/**
 * Password strength checker
 */
export class PasswordStrengthChecker {
  private static readonly MIN_LENGTH = 8;
  private static readonly REQUIREMENTS = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  };

  static checkStrength(password: string): {
    score: number;
    strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    feedback: string[];
    meetsRequirements: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    // Basis lengte check
    if (password.length < this.MIN_LENGTH) {
      feedback.push(`Password moet minimaal ${this.MIN_LENGTH} karakters lang zijn`);
    } else {
      score += 1;
    }

    // Karakter type checks
    if (this.REQUIREMENTS.lowercase.test(password)) {
      score += 1;
    } else {
      feedback.push('Voeg kleine letters toe (a-z)');
    }

    if (this.REQUIREMENTS.uppercase.test(password)) {
      score += 1;
    } else {
      feedback.push('Voeg hoofdletters toe (A-Z)');
    }

    if (this.REQUIREMENTS.numbers.test(password)) {
      score += 1;
    } else {
      feedback.push('Voeg cijfers toe (0-9)');
    }

    if (this.REQUIREMENTS.special.test(password)) {
      score += 1;
    } else {
      feedback.push('Voeg speciale karakters toe (!@#$%^&*)');
    }

    // Extra punten voor lengte
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Bepaal strength level
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score <= 2) strength = 'weak';
    else if (score <= 4) strength = 'medium';
    else if (score <= 6) strength = 'strong';
    else strength = 'very-strong';

    const meetsRequirements = score >= 4 && password.length >= this.MIN_LENGTH;

    return {
      score,
      strength,
      feedback,
      meetsRequirements
    };
  }

  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dragon', 'master', 'sunshine', 'princess', 'qwerty123'
    ];

    return commonPasswords.includes(password.toLowerCase());
  }
}

/**
 * JWT utilities (simpele implementatie)
 */
export class JWTUtils {
  private static readonly SECRET = 'your-secret-key-change-in-production';
  private static readonly ALGORITHM = 'HS256';

  static generateToken(payload: any, expiresIn: string = '1h'): string {
    const header = {
      alg: this.ALGORITHM,
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.parseExpiresIn(expiresIn);

    const data = {
      ...payload,
      iat: now,
      exp
    };

    // Simpele base64 encoding (in productie zou je een echte JWT library gebruiken)
    const headerB64 = btoa(JSON.stringify(header));
    const payloadB64 = btoa(JSON.stringify(data));
    
    // Simpele signature (niet veilig voor productie)
    const signature = btoa(this.SECRET + headerB64 + payloadB64);

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  static verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }

      const [headerB64, payloadB64, signature] = parts;
      
      // Decode payload
      const payload = JSON.parse(atob(payloadB64));
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'Token expired' };
      }

      // Simpele signature check (niet veilig voor productie)
      const expectedSignature = btoa(this.SECRET + headerB64 + payloadB64);
      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: 'Token verification failed' };
    }
  }

  private static parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 60 * 60; // 1 uur default
    }
  }
}

/**
 * Encryption utilities
 */
export class EncryptionUtils {
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoded
    );

    return { encrypted, iv };
  }

  static async decrypt(encrypted: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  }

  static async hash(data: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static sanitizeSQL(input: string): string {
    return input
      .replace(/['";\\]/g, '')
      .replace(/\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }

  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      // Alleen HTTP en HTTPS URLs toestaan
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }
}

/**
 * Security validation utilities
 */
export class SecurityValidator {
  static validateEmail(email: string): boolean {
    return securityManager.validateEmail(email);
  }

  static validateURL(url: string): boolean {
    return securityManager.validateURL(url);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateCreditCard(cardNumber: string): boolean {
    // Luhn algorithm implementatie
    const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  static validateStrongPassword(password: string): boolean {
    const checker = PasswordStrengthChecker.checkStrength(password);
    return checker.meetsRequirements && !PasswordStrengthChecker.isCommonPassword(password);
  }
}

/**
 * Security monitoring utilities
 */
export class SecurityMonitor {
  private static events: Array<{
    timestamp: Date;
    event: string;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  static logEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const logEntry = {
      timestamp: new Date(),
      event,
      details,
      severity
    };

    this.events.push(logEntry);
    securityManager.logSecurityEvent(event, { ...details, severity });

    // Log naar console met kleur
    const colors = {
      low: '\x1b[32m',      // Groen
      medium: '\x1b[33m',   // Geel
      high: '\x1b[31m',     // Rood
      critical: '\x1b[35m'  // Magenta
    };

    console.log(`${colors[severity]}🔒 [${severity.toUpperCase()}] ${event}\x1b[0m`, details);
  }

  static getEvents(severity?: 'low' | 'medium' | 'high' | 'critical'): typeof this.events {
    if (severity) {
      return this.events.filter(e => e.severity === severity);
    }
    return [...this.events];
  }

  static clearEvents(): void {
    this.events = [];
  }

  static getEventStats(): { total: number; bySeverity: Record<string, number> } {
    const bySeverity: Record<string, number> = {};
    
    this.events.forEach(event => {
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
    });

    return {
      total: this.events.length,
      bySeverity
    };
  }
}

// Export utility functions
export const checkPasswordStrength = (password: string) => PasswordStrengthChecker.checkStrength(password);
export const isCommonPassword = (password: string) => PasswordStrengthChecker.isCommonPassword(password);
export const generateJWT = (payload: any, expiresIn?: string) => JWTUtils.generateToken(payload, expiresIn);
export const verifyJWT = (token: string) => JWTUtils.verifyToken(token);
export const sanitizeHTML = (input: string) => InputSanitizer.sanitizeHTML(input);
export const sanitizeSQL = (input: string) => InputSanitizer.sanitizeSQL(input);
export const sanitizeFilename = (filename: string) => InputSanitizer.sanitizeFilename(filename);
export const sanitizeURL = (url: string) => InputSanitizer.sanitizeURL(url);
export const validateEmail = (email: string) => SecurityValidator.validateEmail(email);
export const validatePhoneNumber = (phone: string) => SecurityValidator.validatePhoneNumber(phone);
export const validateCreditCard = (cardNumber: string) => SecurityValidator.validateCreditCard(cardNumber);
export const validateStrongPassword = (password: string) => SecurityValidator.validateStrongPassword(password);
export const logSecurityEvent = (event: string, details: any, severity?: 'low' | 'medium' | 'high' | 'critical') => 
  SecurityMonitor.logEvent(event, details, severity);
