// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configuration
beforeEach(() => {
  // Reset any test state
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Set viewport for consistent testing
  cy.viewport(1280, 720);
});

// Add custom commands for common operations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with test credentials
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<Element>;
      
      /**
       * Custom command to clear all test data
       * @example cy.clearTestData()
       */
      clearTestData(): Chainable<Element>;
      
      /**
       * Custom command to wait for service worker to be ready
       * @example cy.waitForServiceWorker()
       */
      waitForServiceWorker(): Chainable<Element>;
      
      /**
       * Custom command to check PWA installation status
       * @example cy.checkPWAStatus()
       */
      checkPWAStatus(): Chainable<Element>;
    }
  }
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are not related to the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  
  if (err.message.includes('Non-Error promise rejection')) {
    return false;
  }
  
  // Log the error for debugging
  console.warn('Uncaught exception:', err.message);
  return false;
});

// Global test configuration
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);
Cypress.config('responseTimeout', 10000);

// Add custom commands for common operations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with test credentials
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<Element>;
      
      /**
       * Custom command to clear all test data
       * @example cy.clearTestData()
       */
      clearTestData(): Chainable<Element>;
      
      /**
       * Custom command to wait for service worker to be ready
       * @example cy.waitForServiceWorker()
       */
      waitForServiceWorker(): Chainable<Element>;
      
      /**
       * Custom command to check PWA installation status
       * @example cy.checkPWAStatus()
       */
      checkPWAStatus(): Chainable<Element>;
    }
  }
}

