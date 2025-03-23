/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
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
    createTestProject(name?: string): Chainable<void>;
    
    /**
     * Custom command to create a new task for testing
     * @example cy.createTestTask('Project name', 'Task name')
     */
    createTestTask(projectName: string, taskTitle?: string): Chainable<void>;
  }
} 