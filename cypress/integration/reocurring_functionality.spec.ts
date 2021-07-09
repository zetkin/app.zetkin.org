describe.skip('Reocurring functionality', () => {

    it('contains a clickable org logo which leads to org page', () => {
        cy.visit('/o/1/events');
        cy.get('[data-testid="org-avatar"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /\/o\/1$/);
    });
});

// Hack to flag for typescript as module
export {};
