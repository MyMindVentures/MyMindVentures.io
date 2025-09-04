# ⚙️ Project Configuration - MyMindVentures.io PWA

## 📋 Project Overzicht

**Project Naam:** MyMindVentures.io PWA  
**Versie:** 2.0.0  
**Type:** Progressive Web Application  
**Architectuur:** Layered Architecture (Controller-Service-Repository)  
**Framework:** React + TypeScript + Vite  
**Backend:** Supabase  
**Deployment:** Vercel  
**Status:** 🚀 Production Ready  

---

## 🏗️ Architecture Configuration

### **Layered Architecture Pattern:**
```typescript
src/
├── lib/
│   ├── architecture/
│   │   ├── BaseController.ts    // Abstract controller base
│   │   ├── BaseService.ts       // Abstract service base
│   │   ├── BaseRepository.ts    // Abstract repository base
│   │   └── types/
│   │       └── base.ts          // Interface definitions
│   ├── security/                // Security implementations
│   ├── monitoring/              // Monitoring & analytics
│   ├── i18n/                   // Internationalization
│   ├── privacy/                 // Privacy & compliance
│   └── performance/             // Performance optimization
├── components/                  // React components
├── pages/                      // Route components
└── __tests__/                  // Test files
```

### **Design Patterns:**
- **SOLID Principles:** ✅ Implemented
- **Dependency Injection:** ✅ Implemented
- **Repository Pattern:** ✅ Implemented
- **Service Layer:** ✅ Implemented
- **Controller Pattern:** ✅ Implemented

---

## 🔧 Build & Development Configuration

### **Package Manager:** npm
### **Node.js Versie:** 18.x (LTS)
### **Package Scripts:**
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "build:staging": "tsc && vite build --mode staging",
  "build:production": "tsc && vite build --mode production",
  "preview": "vite preview",
  "test": "vitest",
  "test:unit": "vitest run --reporter=verbose",
  "test:integration": "vitest run integration",
  "test:e2e": "cypress run",
  "test:coverage": "vitest run --coverage",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "type-check": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "security:audit": "npm audit --audit-level=moderate",
  "lighthouse": "lhci autorun",
  "bundle:analyze": "vite-bundle-analyzer"
}
```

### **Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
          ui: ['@radix-ui/react-*']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
```

### **TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/lib/*": ["src/lib/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🚀 Deployment Configuration

### **Vercel Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/manifest.json",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/offline.html",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "src": "/api/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### **Environment Variables:**
```bash
# .env.local (niet in git)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=your_posthog_host

# .env.staging
VITE_ENV=staging
VITE_API_URL=https://staging-api.mymindventures.io
VITE_DEBUG=true

# .env.production
VITE_ENV=production
VITE_API_URL=https://api.mymindventures.io
VITE_DEBUG=false
```

---

## 🧪 Testing Configuration

### **Vitest Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    }
  }
});
```

### **Cypress Configuration:**
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}'
  }
});
```

---

## 🔒 Security Configuration

### **Helmet Configuration:**
```typescript
// src/lib/security/helmetConfig.ts
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.mymindventures.io"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
};
```

### **Rate Limiting Configuration:**
```typescript
// src/lib/privacy/rateLimitConfig.ts
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minuten
  max: 100, // max 100 requests per windowMs
  message: 'Te veel requests van dit IP, probeer het later opnieuw.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.ip || req.connection.remoteAddress,
  skip: (req: any) => req.path.startsWith('/health') || req.path.startsWith('/metrics')
};
```

---

## 📊 Monitoring Configuration

### **Sentry Configuration:**
```typescript
// src/lib/monitoring/sentryConfig.ts
export const sentryConfig = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENV || 'development',
  release: '2.0.0',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation
    }),
    new Sentry.Replay()
  ]
};
```

### **PostHog Configuration:**
```typescript
// src/lib/monitoring/posthogConfig.ts
export const posthogConfig = {
  apiKey: import.meta.env.VITE_POSTHOG_KEY,
  apiHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  capturePageview: true,
  capturePageleave: true,
  autocapture: true,
  disableSessionRecording: false,
  enableRecordingConsoleLog: true,
  enableRecordingNetworkRequests: true
};
```

### **Performance Monitoring:**
```typescript
// src/lib/monitoring/performanceConfig.ts
export const performanceConfig = {
  coreWebVitals: {
    lcp: { threshold: 2.5, weight: 0.25 },
    fid: { threshold: 100, weight: 0.25 },
    cls: { threshold: 0.1, weight: 0.25 },
    ttfb: { threshold: 800, weight: 0.25 }
  },
  metrics: {
    fcp: true,
    lcp: true,
    fid: true,
    cls: true,
    ttfb: true,
    navigation: true,
    resource: true
  }
};
```

---

## 🌐 Internationalization Configuration

### **i18next Configuration:**
```typescript
// src/lib/i18n/config.ts
export const i18nConfig = {
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'nl',
  supportedLngs: ['nl', 'en', 'de', 'fr', 'es'],
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage', 'sessionStorage']
  },
  react: { useSuspense: false },
  defaultNS: 'common',
  ns: ['common', 'auth', 'dashboard', 'errors', 'validation'],
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.json'
  }
};
```

### **Supported Languages:**
```typescript
export const SUPPORTED_LANGUAGES = {
  nl: { name: 'Nederlands', flag: '🇳🇱', rtl: false },
  en: { name: 'English', flag: '🇬🇧', rtl: false },
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false }
};
```

---

## 🔄 CI/CD Configuration

### **GitHub Actions Workflows:**
- **`ci-cd.yml`** - Main CI/CD pipeline
- **`security.yml`** - Security scanning
- **`performance.yml`** - Performance testing
- **`deploy.yml`** - Deployment automation
- **`codeql.yml`** - Code quality analysis
- **`continuous-integration-loop.yml`** - Continuous integration loop
- **`workflow-orchestrator.yml`** - Workflow orchestration

### **Workflow Triggers:**
```yaml
on:
  push:
    branches: [main, develop, feature/*, hotfix/*]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options: [development, staging, production]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### **Environment Secrets:**
```bash
# GitHub Secrets (niet in code)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_project_id
SENTRY_AUTH_TOKEN=your_sentry_token
POSTHOG_API_KEY=your_posthog_key
```

---

## 📱 PWA Configuration

### **Web App Manifest:**
```json
// public/manifest.json
{
  "name": "MyMindVentures.io PWA",
  "short_name": "MyMindVentures",
  "description": "Enterprise-grade Progressive Web Application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "nl",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### **Service Worker Configuration:**
```typescript
// public/sw.js
const CACHE_NAME = 'mymindventures-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

const DYNAMIC_ASSETS = [
  '/api/',
  '/dashboard/',
  '/profile/'
];
```

---

## 🗄️ Database Configuration

### **Supabase Configuration:**
```typescript
// src/lib/supabase/config.ts
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'mymindventures-pwa@2.0.0'
      }
    }
  }
};
```

### **Database Tables:**
```sql
-- Core tables
ai_insights_perplexity
ai_guides
workflow_states
project_configs
user_sessions
error_logs
performance_metrics

-- Security tables
security_audits
rate_limit_logs
gdpr_consents
data_processing_records

-- Monitoring tables
application_logs
user_analytics
performance_data
deployment_logs
```

---

## 🎯 Performance Configuration

### **Lazy Loading Configuration:**
```typescript
// src/lib/performance/lazyLoadingConfig.ts
export const lazyLoadingConfig = {
  retryAttempts: 3,
  retryDelay: 1000,
  loadingComponent: 'LoadingSpinner',
  errorComponent: 'ErrorBoundary',
  preloadThreshold: 0.1,
  intersectionThreshold: 0.5,
  rootMargin: '50px'
};
```

### **Bundle Analysis Configuration:**
```typescript
// src/lib/performance/bundleConfig.ts
export const bundleConfig = {
  analyze: process.env.NODE_ENV === 'production',
  gzip: true,
  brotli: true,
  splitChunks: {
    vendor: ['react', 'react-dom'],
    utils: ['lodash', 'date-fns'],
    ui: ['@radix-ui/react-*']
  },
  optimization: {
    minimize: true,
    concatenateModules: true,
    sideEffects: false
  }
};
```

---

## 📋 Environment-Specific Configurations

### **Development Environment:**
```typescript
export const devConfig = {
  debug: true,
  logging: 'verbose',
  cache: false,
  mockData: true,
  hotReload: true,
  sourceMaps: true,
  performanceMonitoring: false
};
```

### **Staging Environment:**
```typescript
export const stagingConfig = {
  debug: true,
  logging: 'info',
  cache: true,
  mockData: false,
  hotReload: false,
  sourceMaps: true,
  performanceMonitoring: true
};
```

### **Production Environment:**
```typescript
export const productionConfig = {
  debug: false,
  logging: 'warn',
  cache: true,
  mockData: false,
  hotReload: false,
  sourceMaps: false,
  performanceMonitoring: true
};
```

---

## 🔧 Maintenance & Updates

### **Dependency Update Schedule:**
- **Security Updates:** Automatisch (dagelijks)
- **Minor Updates:** Wekelijks
- **Major Updates:** Maandelijks
- **Breaking Changes:** Kwartaal

### **Backup Schedule:**
- **Database:** Dagelijks (3:00 AM UTC)
- **Code:** Bij elke commit
- **Assets:** Wekelijks
- **Configuration:** Bij elke deployment

### **Health Check Endpoints:**
```typescript
export const healthCheckEndpoints = {
  liveness: '/health/live',
  readiness: '/health/ready',
  startup: '/health/startup',
  metrics: '/metrics',
  status: '/status'
};
```

---

## 📞 Support & Troubleshooting

### **Common Issues:**
1. **Build Failures:** Check Node.js versie en dependencies
2. **Deployment Issues:** Verify Vercel configuratie en secrets
3. **Performance Issues:** Run Lighthouse CI en bundle analyzer
4. **Security Issues:** Check security scanning results
5. **Test Failures:** Verify test environment en mocks

### **Debug Commands:**
```bash
# Development
npm run dev                    # Start development server
npm run build                 # Build for production
npm run test                  # Run all tests
npm run test:coverage        # Run tests with coverage

# Production
npm run build:production      # Build for production
npm run lighthouse           # Run performance tests
npm run security:audit       # Run security audit
npm run bundle:analyze       # Analyze bundle size
```

---

*Deze configuratie wordt automatisch bijgewerkt door de CI/CD workflow en bevat alle project-specifieke instellingen.*
