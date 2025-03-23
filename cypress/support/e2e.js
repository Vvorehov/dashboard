// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';

// Add any additional configurations needed for the Task Dashboard app
Cypress.on('window:before:load', (win) => {
  // We want to preserve localStorage between tests in some cases
  // But we're manually clearing it in the beforeEach hook of our tests
});

// Custom commands for debugging
Cypress.Commands.add('logState', () => {
  cy.window().then((win) => {
    console.log('Current localStorage:', win.localStorage);
    console.log('Current URL:', win.location.href);
  });
});

// Add custom commands if needed
// Cypress.Commands.add('login', () => {
//   // Implementation of a login command
// }); 