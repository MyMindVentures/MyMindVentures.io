// Import commands.js using ES2015 syntax:
import './commands';

// Component testing specific configuration
import { mount } from 'cypress/react18';

// Augment the Cypress namespace to include mount
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Global component test configuration
beforeEach(() => {
  // Reset any test state
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Mock IntersectionObserver for component tests
const mockIntersectionObserver = {
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
};

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: mockIntersectionObserver,
});

// Mock ResizeObserver for component tests
const mockResizeObserver = {
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
};

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: mockResizeObserver,
});

// Mock matchMedia for component tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => null,
    removeListener: () => null,
    addEventListener: () => null,
    removeEventListener: () => null,
    dispatchEvent: () => null,
  }),
});
