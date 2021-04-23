describe('/', () => {
    it('contains zetkin logo', () => {
        cy.visit('/');
        cy.get('[data-testid="zetkin-logotype"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};