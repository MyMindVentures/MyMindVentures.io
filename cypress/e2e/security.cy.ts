describe('Security Features', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearTestData();
  });

  describe('Security Dashboard', () => {
    it('should display security dashboard with all variants', () => {
      // Test compact variant
      cy.get('[data-testid="security-dashboard"]').should('exist');
      cy.get('[data-testid="security-status"]').should('be.visible');
      
      // Test card variant
      cy.get('[data-testid="variant-card"]').click();
      cy.get('[data-testid="security-events"]').should('be.visible');
      
      // Test detailed variant
      cy.get('[data-testid="variant-detailed"]').click();
      cy.get('[data-testid="security-config"]').should('be.visible');
      cy.get('[data-testid="password-checker"]').should('be.visible');
    });

    it('should check password strength correctly', () => {
      cy.get('[data-testid="variant-detailed"]').click();
      
      // Test weak password
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="password-strength"]').should('contain', 'Weak');
      
      // Test strong password
      cy.get('[data-testid="password-input"]').clear().type('StrongPass123!');
      cy.get('[data-testid="password-strength"]').should('contain', 'Strong');
    });

    it('should display security events', () => {
      cy.get('[data-testid="variant-card"]').click();
      cy.get('[data-testid="security-events"]').should('be.visible');
      cy.get('[data-testid="event-list"]').should('exist');
    });
  });

  describe('Input Validation', () => {
    it('should prevent XSS attacks in form inputs', () => {
      // Test script injection
      const xssInput = '<script>alert("xss")</script>';
      cy.get('[data-testid="test-input"]').type(xssInput);
      cy.get('[data-testid="test-input"]').should('not.contain.value', '<script>');
      
      // Test if sanitized input is displayed safely
      cy.get('[data-testid="sanitized-output"]').should('not.contain', '<script>');
    });

    it('should prevent SQL injection attempts', () => {
      const sqlInput = "'; DROP TABLE users; --";
      cy.get('[data-testid="test-input"]').type(sqlInput);
      
      // Check if dangerous SQL is sanitized
      cy.get('[data-testid="sanitized-output"]').should('not.contain', 'DROP TABLE');
    });

    it('should validate email format', () => {
      // Valid email
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="email-validation"]').should('contain', 'Valid');
      
      // Invalid email
      cy.get('[data-testid="email-input"]').clear().type('invalid-email');
      cy.get('[data-testid="email-validation"]').should('contain', 'Invalid');
    });

    it('should validate URL format', () => {
      // Valid URL
      cy.get('[data-testid="url-input"]').type('https://example.com');
      cy.get('[data-testid="url-validation"]').should('contain', 'Valid');
      
      // Invalid URL
      cy.get('[data-testid="url-input"]').clear().type('not-a-url');
      cy.get('[data-testid="url-validation"]').should('contain', 'Invalid');
    });
  });

  describe('Authentication Security', () => {
    it('should require strong passwords during registration', () => {
      cy.visit('/register');
      
      // Weak password should show error
      cy.get('[data-testid="password-input"]').type('weak');
      cy.get('[data-testid="password-error"]').should('be.visible');
      
      // Strong password should be accepted
      cy.get('[data-testid="password-input"]').clear().type('StrongPass123!');
      cy.get('[data-testid="password-error"]').should('not.exist');
    });

    it('should enforce rate limiting on login attempts', () => {
      cy.visit('/login');
      
      // Multiple failed login attempts
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="email-input"]').type('test@example.com');
        cy.get('[data-testid="password-input"]').type('wrongpassword');
        cy.get('[data-testid="login-button"]').click();
        cy.get('[data-testid="error-message"]').should('be.visible');
      }
      
      // Should show rate limit message
      cy.get('[data-testid="rate-limit-message"]').should('be.visible');
    });

    it('should validate JWT tokens', () => {
      // Test with invalid token
      cy.window().then((win) => {
        win.localStorage.setItem('authToken', 'invalid-token');
      });
      
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });

  describe('Content Security', () => {
    it('should enforce HTTPS in production', () => {
      // This test would run in production environment
      if (Cypress.env('NODE_ENV') === 'production') {
        cy.url().should('match', /^https:/);
      }
    });

    it('should have proper security headers', () => {
      cy.request('/').then((response) => {
        expect(response.headers).to.have.property('x-frame-options');
        expect(response.headers).to.have.property('x-content-type-options');
        expect(response.headers).to.have.property('referrer-policy');
      });
    });

    it('should prevent clickjacking', () => {
      cy.request('/').then((response) => {
        expect(response.headers['x-frame-options']).to.equal('DENY');
      });
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize file uploads', () => {
      // Test with potentially dangerous filename
      const dangerousFilename = '../../../etc/passwd';
      cy.get('[data-testid="file-input"]').attachFile({
        fileContent: 'test content',
        fileName: dangerousFilename,
        mimeType: 'text/plain'
      });
      
      // Filename should be sanitized
      cy.get('[data-testid="filename-display"]').should('not.contain', '..');
    });

    it('should sanitize HTML content', () => {
      const htmlInput = '<p>Safe content</p><script>alert("dangerous")</script>';
      cy.get('[data-testid="html-input"]').type(htmlInput);
      
      // Script tags should be removed
      cy.get('[data-testid="sanitized-html"]').should('not.contain', '<script>');
      cy.get('[data-testid="sanitized-html"]').should('contain', 'Safe content');
    });
  });

  describe('Error Handling', () => {
    it('should not expose sensitive information in error messages', () => {
      // Trigger an error
      cy.visit('/nonexistent-route');
      
      // Error message should not contain internal details
      cy.get('[data-testid="error-message"]').should('not.contain', 'internal');
      cy.get('[data-testid="error-message"]').should('not.contain', 'stack');
    });

    it('should log security events', () => {
      // Trigger a security event
      cy.get('[data-testid="test-input"]').type('<script>alert("test")</script>');
      
      // Check if event is logged
      cy.get('[data-testid="security-log"]').should('contain', 'XSS attempt detected');
    });
  });

  describe('Access Control', () => {
    it('should enforce role-based access control', () => {
      // Login as regular user
      cy.login('user@example.com', 'password123');
      
      // Try to access admin route
      cy.visit('/admin');
      cy.url().should('include', '/unauthorized');
    });

    it('should require authentication for protected routes', () => {
      // Visit protected route without authentication
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });
});
