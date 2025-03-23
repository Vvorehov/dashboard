describe('Battleship Game E2E Tests', () => {
  beforeEach(() => {
    // Visit the app's main page
    cy.visit('/');
  });

  it('should have correct title', () => {
    cy.title().should('include', 'Battleship Game');
  });

  it('should display the game interface', () => {
    // Check for basic game interface elements
    cy.get('body').should('be.visible');
    
    // Take a screenshot to see what's actually rendered
    cy.screenshot('game-interface');

    // Log the entire DOM structure to understand the app better
    cy.document().then((doc) => {
      cy.log('Document body HTML structure:');
      cy.log(doc.body.innerHTML.substring(0, 500) + '...');
    });
  });

  it('should explore the DOM elements', () => {
    // Get all divs and log their classes to understand the structure
    cy.get('div').then($divs => {
      cy.log(`Found ${$divs.length} div elements on the page`);
      
      // Log classes of first 5 divs to understand naming conventions
      for (let i = 0; i < Math.min(5, $divs.length); i++) {
        const classNames = $divs[i].className;
        const id = $divs[i].id;
        cy.log(`Div ${i+1} - ID: ${id || 'none'}, Classes: ${classNames || 'none'}`);
      }
    });
  });
}); 