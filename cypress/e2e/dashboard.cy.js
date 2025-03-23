/**
 * Task Dashboard E2E Tests
 * 
 * These tests verify the core functionality of the Task Dashboard application.
 */
describe('Task Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    cy.get('body').should('be.visible');
  });

  it('should have the correct title', () => {
    cy.title().should('include', 'Task Dashboard');
  });

  it('should display the dashboard homepage', () => {
    cy.get('.app-title').should('contain', 'Task Dashboard');
    cy.get('.header-actions').should('be.visible');
    
    // Take a screenshot of the homepage
    cy.screenshot('dashboard-homepage');
  });

  it('should navigate to new project page', () => {
    // Find the New Project button by text content
    cy.contains('New Project').click();
    
    // Verify we're on the project creation page by URL
    cy.url().should('include', '/projects/new');
    
    // Verify the form is present
    cy.get('form').should('be.visible');
    cy.contains('Create Project').should('be.visible');
    
    // Take a screenshot
    cy.screenshot('new-project-page');
  });

  it('should navigate back to dashboard', () => {
    // Navigate to new project page
    cy.contains('New Project').click();
    
    // Now go back to the home
    cy.contains('Home').click();
    
    // Verify we're back on the dashboard
    cy.url().should('include', '/dashboard');
    cy.get('.home-container').should('be.visible');
  });
}); 