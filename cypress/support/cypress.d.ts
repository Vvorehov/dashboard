/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to initialize the app and detect base path
     * @example cy.initApp()
     */
    initApp(): Chainable<void>;

    /**
     * Custom command to generate a URL with the correct application base path
     * @example cy.appUrl('/projects/new')
     */
    appUrl(path: string): Chainable<string>;

    /**
     * Custom command to navigate to a route with the correct application base path
     * @example cy.navigateTo('/projects/new')
     */
    navigateTo(path: string): Chainable<void>;

    /**
     * Custom command to log current state for debugging
     * @example cy.logState()
     */
    logState(): Chainable<void>;
    
    /**
     * Custom command to select a task by its title
     * @example cy.getTaskByTitle('Task name')
     */
    getTaskByTitle(title: string): Chainable<JQuery<HTMLElement>>;
    
    /**
     * Custom command to create a new project for testing
     * @example cy.createTestProject('Project name')
     */
    createTestProject(name?: string): Chainable<string>;
    
    /**
     * Custom command to create a new task for testing
     * @example cy.createTestTask('project-id', 'Task name')
     */
    createTestTask(projectId: string, taskTitle?: string): Chainable<string>;
  }
} 