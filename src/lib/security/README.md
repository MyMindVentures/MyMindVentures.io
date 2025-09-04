# 🔒 Security Implementation

## 📋 Overzicht
Deze security implementatie voor MyMindVentures.io biedt een complete security laag met Helmet voor HTTP headers, Zod/Yup voor data validatie, en uitgebreide security utilities. De implementatie volgt OWASP best practices en industry standards.

## ✨ Features

### 🔧 Core Security Features
- **Helmet Integration** - HTTP security headers
- **Data Validation** - Zod en Yup schema validatie
- **Input Sanitization** - XSS en SQL injection preventie
- **Rate Limiting** - DDoS bescherming
- **CORS Protection** - Cross-origin resource sharing beveiliging
- **Authentication Middleware** - JWT-based auth
- **Role-Based Access Control** - RBAC implementatie

### 🎯 Advanced Security Features
- **Password Strength Checking** - Real-time password validatie
- **Security Monitoring** - Event logging en tracking
- **Encryption Utilities** - AES-GCM encryptie
- **JWT Management** - Token generatie en validatie
- **Security Headers** - Comprehensive HTTP security
- **Request Validation** - Content type en size limiting

## 🏗️ Architectuur

```
src/lib/security/
├── SecurityManager.ts       # Hoofd security manager
├── SecurityMiddleware.ts    # Express.js middleware
├── SecurityUtils.ts         # Utility functies
├── README.md                # Deze documentatie
└── components/              # React security componenten
    └── SecurityDashboard.tsx # Security dashboard
```

## 🚀 Setup & Installatie

### 1. Dependencies Installeren
```bash
npm install helmet zod yup @types/helmet
```

### 2. Security Manager Initialiseren
```typescript
import { securityManager } from './lib/security/SecurityManager';

// Default configuratie gebruiken
const security = securityManager;

// Of custom configuratie
const customSecurity = new SecurityManager({
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
  }
});
```

### 3. Helmet Middleware Toevoegen
```typescript
import { securityManager } from './lib/security/SecurityManager';

// Helmet middleware ophalen
const helmetMiddleware = securityManager.getHelmetMiddleware();

// In Express app gebruiken
app.use(helmetMiddleware);
```

## 📱 Componenten Gebruik

### SecurityDashboard Component
```tsx
import { SecurityDashboard } from './components/security/SecurityDashboard';

// Compact variant
<SecurityDashboard variant="compact" />

// Card variant (default)
<SecurityDashboard 
  variant="card"
  showEvents={true}
  showConfig={true}
  showPasswordChecker={true}
/>

// Detailed variant
<SecurityDashboard variant="detailed" />
```

### Props
- `variant`: 'compact' | 'detailed' | 'card'
- `showEvents`: Toon security events
- `showConfig`: Toon security configuratie
- `showPasswordChecker`: Toon password strength checker

## 🔧 Security Manager API

### Basis Gebruik
```typescript
import { securityManager } from './lib/security/SecurityManager';

// Configuratie ophalen
const config = securityManager.getConfig();

// Configuratie updaten
securityManager.updateConfig({
  helmet: { contentSecurityPolicy: false }
});

// Data valideren met Zod
const result = securityManager.validateWithZod(UserSchema, userData);
if (result.success) {
  const validUser = result.data;
} else {
  console.error('Validation error:', result.error);
}

// Data valideren met Yup
const yupResult = await securityManager.validateWithYup(UserYupSchema, userData);
```

### Input Sanitization
```typescript
// Input sanitizen
const cleanInput = securityManager.sanitizeInput(userInput);

// XSS check
const hasXSS = securityManager.containsXSS(input);

// SQL injection check
const hasSQLInjection = securityManager.containsSQLInjection(input);
```

## 🛡️ Security Middleware

### Express.js Middleware
```typescript
import { securityMiddleware } from './lib/security/SecurityMiddleware';

// Alle middleware functies ophalen
const middleware = securityMiddleware.getAllMiddleware();

// CORS middleware
app.use(middleware.cors);

// Rate limiting
app.use(middleware.rateLimit);

// Security headers
app.use(middleware.securityHeaders);

// Request logging
app.use(middleware.requestLogging);

// Input validatie voor specifieke velden
app.use('/api/users', middleware.validateInput(['email', 'name']));

// Authentication vereist
app.use('/api/protected', middleware.requireAuth);

// Role-based access
app.use('/api/admin', middleware.requireRole(['admin']));

// Content type validatie
app.use('/api/upload', middleware.validateContentType(['multipart/form-data']));

// Request size limiting
app.use('/api/upload', middleware.limitRequestSize(5 * 1024 * 1024)); // 5MB
```

### Custom Middleware Configuratie
```typescript
const customMiddleware = new SecurityMiddleware({
  enableCORS: true,
  enableRateLimit: true,
  corsOrigins: ['https://mydomain.com'],
  rateLimitWindow: 10 * 60 * 1000, // 10 minuten
  rateLimitMax: 50
});
```

## 🔐 Security Utilities

### Password Strength Checking
```typescript
import { checkPasswordStrength, isCommonPassword } from './lib/security/SecurityUtils';

const strength = checkPasswordStrength('MyPassword123!');
console.log(strength.strength); // 'strong'
console.log(strength.score); // 6
console.log(strength.feedback); // []

const isCommon = isCommonPassword('password123'); // true
```

### JWT Management
```typescript
import { generateJWT, verifyJWT } from './lib/security/SecurityUtils';

// Token genereren
const token = generateJWT({ userId: '123', role: 'admin' }, '24h');

// Token verifiëren
const result = verifyJWT(token);
if (result.valid) {
  console.log('User:', result.payload.userId);
} else {
  console.error('Invalid token:', result.error);
}
```

### Input Sanitization
```typescript
import { 
  sanitizeHTML, 
  sanitizeSQL, 
  sanitizeFilename, 
  sanitizeURL 
} from './lib/security/SecurityUtils';

const cleanHTML = sanitizeHTML('<script>alert("xss")</script>');
const cleanSQL = sanitizeSQL("'; DROP TABLE users; --");
const cleanFilename = sanitizeFilename('file<script>.txt');
const cleanURL = sanitizeURL('javascript:alert("xss")');
```

### Security Validation
```typescript
import { 
  validateEmail, 
  validatePhoneNumber, 
  validateCreditCard,
  validateStrongPassword 
} from './lib/security/SecurityUtils';

const isValidEmail = validateEmail('user@example.com');
const isValidPhone = validatePhoneNumber('+31 6 12345678');
const isValidCard = validateCreditCard('4532015112830366');
const isStrongPassword = validateStrongPassword('MySecurePass123!');
```

### Encryption
```typescript
import { EncryptionUtils } from './lib/security/SecurityUtils';

// Key genereren
const key = await EncryptionUtils.generateKey();

// Data encrypten
const { encrypted, iv } = await EncryptionUtils.encrypt('secret data', key);

// Data decrypten
const decrypted = await EncryptionUtils.decrypt(encrypted, key, iv);

// Hash genereren
const hash = await EncryptionUtils.hash('password', 'SHA-256');
```

## 📊 Security Monitoring

### Event Logging
```typescript
import { logSecurityEvent, SecurityMonitor } from './lib/security/SecurityUtils';

// Security event loggen
logSecurityEvent('Login attempt', { userId: '123', ip: '192.168.1.1' }, 'medium');

// Events ophalen
const events = SecurityMonitor.getEvents();
const highSeverityEvents = SecurityMonitor.getEvents('high');

// Event statistieken
const stats = SecurityMonitor.getEventStats();
console.log(`Total events: ${stats.total}`);
console.log('Events by severity:', stats.bySeverity);

// Events wissen
SecurityMonitor.clearEvents();
```

## 🎨 Customization

### Security Configuratie Aanpassen
```typescript
// Helmet opties aanpassen
securityManager.updateConfig({
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    }
  }
});

// Validation limieten aanpassen
securityManager.updateConfig({
  validation: {
    maxStringLength: 50000,
    maxArrayLength: 500
  }
});

// Rate limiting aanpassen
securityManager.updateConfig({
  rateLimit: {
    windowMs: 5 * 60 * 1000, // 5 minuten
    maxRequests: 200
  }
});
```

### Custom Validation Schemas
```typescript
import { z } from 'zod';

// Custom Zod schema
const CustomSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  tags: z.array(z.string()).max(5),
  metadata: z.record(z.any()).optional()
});

// Schema gebruiken
const result = securityManager.validateWithZod(CustomSchema, data);
```

## 🧪 Testing

### Security Tests Uitvoeren
```typescript
// XSS testen
const xssTests = [
  '<script>alert("xss")</script>',
  'javascript:alert("xss")',
  '<img src="x" onerror="alert(\'xss\')">'
];

xssTests.forEach(test => {
  const hasXSS = securityManager.containsXSS(test);
  console.log(`XSS test "${test}": ${hasXSS ? 'DETECTED' : 'CLEAN'}`);
});

// SQL injection testen
const sqlTests = [
  "'; DROP TABLE users; --",
  "1 OR 1=1",
  "admin'--"
];

sqlTests.forEach(test => {
  const hasSQL = securityManager.containsSQLInjection(test);
  console.log(`SQL test "${test}": ${hasSQL ? 'DETECTED' : 'CLEAN'}`);
});
```

### Password Strength Tests
```typescript
const passwordTests = [
  'weak',
  'Password123',
  'MySecurePass123!',
  'VeryLongAndSecurePassword123!@#'
];

passwordTests.forEach(password => {
  const strength = checkPasswordStrength(password);
  console.log(`Password "${password}": ${strength.strength} (score: ${strength.score})`);
});
```

## 🚀 Deployment

### Production Configuratie
```typescript
// Production security configuratie
const productionConfig = {
  helmet: {
    contentSecurityPolicy: true,
    hsts: {
      maxAge: 31536000, // 1 jaar
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' }
  },
  validation: {
    strictMode: true,
    maxStringLength: 5000, // Stricter in productie
    maxArrayLength: 50
  },
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000,
    maxRequests: 50 // Stricter in productie
  }
};

securityManager.updateConfig(productionConfig);
```

### Environment Variables
```bash
# Security configuratie
SECURITY_STRICT_MODE=true
SECURITY_MAX_STRING_LENGTH=5000
SECURITY_RATE_LIMIT_MAX=50
SECURITY_CORS_ORIGINS=https://mydomain.com,https://app.mydomain.com

# JWT configuratie
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Helmet configuratie
HELMET_CSP_ENABLED=true
HELMET_HSTS_MAX_AGE=31536000
```

## 📊 Performance Monitoring

### Security Metrics
```typescript
// Security performance meten
const startTime = performance.now();

// Security operatie uitvoeren
const result = securityManager.validateWithZod(UserSchema, largeDataSet);

const endTime = performance.now();
const duration = endTime - startTime;

console.log(`Security validation took ${duration}ms`);

// Security events per minuut
const eventsPerMinute = SecurityMonitor.getEventStats();
console.log('Security events this minute:', eventsPerMinute.total);
```

## 🔒 Security Best Practices

### 1. Input Validation
- Valideer ALLE input data
- Gebruik schema-based validatie
- Sanitize input voordat je het verwerkt

### 2. Authentication & Authorization
- Implementeer JWT met korte expiration times
- Gebruik role-based access control
- Valideer tokens op elke request

### 3. Rate Limiting
- Implementeer rate limiting op alle endpoints
- Monitor voor suspicious patterns
- Log rate limit violations

### 4. Security Headers
- Gebruik Helmet voor security headers
- Implementeer Content Security Policy
- Enable HSTS voor HTTPS enforcement

### 5. Data Protection
- Encrypt sensitive data
- Hash passwords met strong algorithms
- Implementeer input sanitization

### 6. Monitoring & Logging
- Log alle security events
- Monitor voor suspicious activity
- Implementeer alerting voor critical events

## 🐛 Troubleshooting

### Veelvoorkomende Problemen

#### 1. Helmet CSP Errors
```typescript
// CSP errors in console
// Oplossing: CSP directives aanpassen
securityManager.updateConfig({
  helmet: {
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    }
  }
});
```

#### 2. Rate Limiting Te Strict
```typescript
// Rate limit errors
// Oplossing: Limieten verhogen
securityManager.updateConfig({
  rateLimit: {
    maxRequests: 200, // Verhoog van 100 naar 200
    windowMs: 15 * 60 * 1000 // 15 minuten
  }
});
```

#### 3. Validation Errors
```typescript
// Validation failures
// Oplossing: Schema aanpassen of data valideren
const result = securityManager.validateWithZod(UserSchema, userData);
if (!result.success) {
  console.error('Validation errors:', result.error);
  // Fix data of schema
}
```

### Debug Mode
```typescript
// Debug mode inschakelen
const debugConfig = {
  validation: {
    strictMode: false, // Minder strict voor debugging
    maxStringLength: 100000,
    maxArrayLength: 1000
  }
};

securityManager.updateConfig(debugConfig);
```

## 📚 Resources

### OWASP Top 10
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Security Libraries
- [Helmet.js](https://helmetjs.github.io/)
- [Zod](https://zod.dev/)
- [Yup](https://github.com/jquense/yup)

### Security Tools
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [GitHub Security](https://github.com/features/security) - Security advisories
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Package security

## 🎯 Volgende Stappen

### Korte Termijn
1. **Security Testing** - Implementeer security tests
2. **Monitoring** - Setup security monitoring en alerting
3. **Documentation** - Uitbreiden van security documentatie

### Lange Termijn
1. **Advanced Threat Detection** - ML-based security
2. **Security Automation** - Automated security responses
3. **Compliance** - GDPR, SOC2 compliance

## 📞 Support

Voor vragen over de security implementatie:
- Check de console logs voor security events
- Gebruik de SecurityDashboard component
- Raadpleeg de OWASP best practices
- Test security features regelmatig

---

**🔒 MyMindVentures.io Security - Enterprise-grade security voor je PWA!**
