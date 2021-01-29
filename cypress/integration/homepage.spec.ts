describe('/', () => {
    it('contains zetkin logo', () => {
        cy.visit('/');
        cy.get('[data-test="zetkin-logotype"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};