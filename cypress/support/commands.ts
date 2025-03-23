// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to select a task by its title
Cypress.Commands.add('getTaskByTitle', (title: string) => {
  return cy.contains('.task-title', title).parents('.task-item');
});

// Custom command to create a new project for testing
Cypress.Commands.add('createTestProject', (name: string = 'Test Project') => {
  cy.visit('/projects');
  cy.contains('Add Project').click();
  cy.get('input[placeholder="Project Name"]').type(name);
  cy.get('textarea[placeholder="Description"]').type('Created for E2E testing');
  cy.contains('button', 'Save').click();
  cy.contains('.project-title', name).should('be.visible');
});

// Custom command to create a new task for testing
Cypress.Commands.add('createTestTask', (projectName: string, taskTitle: string = 'Test Task') => {
  cy.visit('/projects');
  cy.contains('.project-title', projectName).click();
  cy.contains('Add Task').click();
  cy.get('input[placeholder="Task Title"]').type(taskTitle);
  cy.get('textarea[placeholder="Description"]').type('Created for E2E testing');
  cy.get('select[name="priority"]').select('Medium');
  cy.contains('button', 'Save').click();
  cy.contains('.task-title', taskTitle).should('be.visible');
}); 