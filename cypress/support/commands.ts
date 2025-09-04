/// <reference types="cypress" />

// Custom commands for Cypress testing

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Clear test data command
Cypress.Commands.add('clearTestData', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// Wait for service worker command
Cypress.Commands.add('waitForServiceWorker', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      if (win.navigator.serviceWorker) {
        win.navigator.serviceWorker.ready.then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
});

// Check PWA status command
Cypress.Commands.add('checkPWAStatus', () => {
  cy.window().then((win) => {
    // Check if service worker is registered
    cy.wrap(win.navigator.serviceWorker?.getRegistration()).then((registration) => {
      if (registration) {
        cy.log('Service Worker is registered');
      } else {
        cy.log('Service Worker is not registered');
      }
    });
    
    // Check if PWA install prompt is available
    cy.wrap(win.beforeinstallprompt).then((prompt) => {
      if (prompt) {
        cy.log('PWA install prompt is available');
      } else {
        cy.log('PWA install prompt is not available');
      }
    });
  });
});

// Custom command to wait for network idle
Cypress.Commands.add('waitForNetworkIdle', (timeout = 1000) => {
  cy.intercept('*').as('networkRequest');
  cy.wait('@networkRequest', { timeout });
  cy.wait(timeout);
});

// Custom command to check accessibility
Cypress.Commands.add('checkAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Custom command to test responsive design
Cypress.Commands.add('testResponsive', () => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' },
    { width: 1920, height: 1080, name: 'large-desktop' }
  ];
  
  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    cy.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    // Add your responsive test logic here
  });
});

// Custom command to test offline functionality
Cypress.Commands.add('testOffline', () => {
  cy.window().then((win) => {
    // Simulate offline state
    cy.stub(win.navigator, 'onLine').value(false);
    cy.visit('/');
    // Add offline test logic here
  });
});

// Custom command to test PWA installation
Cypress.Commands.add('testPWAInstall', () => {
  cy.window().then((win) => {
    // Mock beforeinstallprompt event
    const mockPrompt = cy.stub().resolves({ outcome: 'accepted' });
    cy.stub(win, 'beforeinstallprompt').value(mockPrompt);
    
    // Trigger install prompt
    cy.get('[data-testid="install-pwa-button"]').click();
    cy.wrap(mockPrompt).should('have.been.called');
  });
});

// Global configuration for all tests
beforeEach(() => {
  // Reset any test state
  cy.clearLocalStorage();
  cy.clearCookies();
});

afterEach(() => {
  // Clean up after each test
  cy.clearLocalStorage();
  cy.clearCookies();
});

