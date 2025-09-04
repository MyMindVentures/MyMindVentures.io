describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  it('should load the homepage successfully', () => {
    cy.get('body').should('be.visible');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display the main navigation', () => {
    cy.get('[data-testid="header"]').should('be.visible');
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });

  it('should have working navigation links', () => {
    // Test main navigation links
    cy.get('[data-testid="nav-link"]').each(($link) => {
      cy.wrap($link).should('be.visible');
      cy.wrap($link).should('have.attr', 'href');
    });
  });

  it('should display the hero section', () => {
    cy.get('[data-testid="hero-section"]').should('be.visible');
    cy.get('[data-testid="hero-title"]').should('contain.text', 'MyMindVentures');
  });

  it('should have responsive design', () => {
    // Test mobile viewport
    cy.setViewport(375, 667);
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    // Test tablet viewport
    cy.setViewport(768, 1024);
    cy.get('[data-testid="tablet-layout"]').should('be.visible');
    
    // Test desktop viewport
    cy.setViewport(1920, 1080);
    cy.get('[data-testid="desktop-layout"]').should('be.visible');
  });

  it('should handle user interactions', () => {
    // Test button clicks
    cy.get('[data-testid="cta-button"]').click();
    cy.url().should('include', '/get-started');
    
    // Go back to homepage
    cy.visit('/');
    
    // Test form interactions
    cy.get('[data-testid="search-input"]').type('test search');
    cy.get('[data-testid="search-input"]').should('have.value', 'test search');
  });

  it('should load images and assets correctly', () => {
    // Check if images load
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible');
      cy.wrap($img).should('have.attr', 'src');
    });
    
    // Check if icons load
    cy.get('[data-testid="icon"]').should('be.visible');
  });

  it('should have proper accessibility', () => {
    // Check for proper heading structure
    cy.get('h1').should('exist');
    cy.get('h2').should('exist');
    
    // Check for alt text on images
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
    
    // Check for proper ARIA labels
    cy.get('[aria-label]').should('exist');
  });

  it('should handle errors gracefully', () => {
    // Test 404 page
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    cy.get('[data-testid="error-page"]').should('be.visible');
    
    // Go back to homepage
    cy.visit('/');
  });

  it('should work offline (PWA features)', () => {
    // Test service worker registration
    cy.window().then((win) => {
      expect(win.navigator.serviceWorker).to.exist;
    });
    
    // Test manifest
    cy.get('link[rel="manifest"]').should('have.attr', 'href');
  });

  it('should have good performance', () => {
    // Check page load time
    cy.window().then((win) => {
      const perfData = win.performance.getEntriesByType('navigation')[0];
      expect(perfData.loadEventEnd - perfData.loadEventStart).to.be.lessThan(3000);
    });
  });

  it('should handle keyboard navigation', () => {
    // Test tab navigation
    cy.get('body').tab();
    cy.focused().should('exist');
    
    // Test enter key
    cy.get('[data-testid="cta-button"]').focus();
    cy.get('[data-testid="cta-button"]').type('{enter}');
    cy.url().should('include', '/get-started');
  });

  it('should maintain state across page reloads', () => {
    // Set some state
    cy.get('[data-testid="theme-toggle"]').click();
    
    // Reload page
    cy.reload();
    
    // Check if state is maintained
    cy.get('[data-testid="theme-toggle"]').should('have.attr', 'data-theme', 'dark');
  });

  it('should handle different browsers', () => {
    // This test will run in different browsers via Playwright
    cy.get('[data-testid="browser-compatibility"]').should('be.visible');
  });
});


