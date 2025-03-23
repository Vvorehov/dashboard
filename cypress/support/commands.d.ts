/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to get a task by its title
     * @example cy.getTaskByTitle('My Task')
     */
    getTaskByTitle(title: string): Chainable<JQuery<HTMLElement>>
  }
} 