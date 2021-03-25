describe('/o/[orgId]/events/[eventId]', () => {
    it('contains non-interactive event content', () => {
        cy.visit('/o/1/events/22');
        cy.get('[data-test="event-title"]').should('be.visible');
        cy.get('[data-test="duration"]').should('be.visible');
        cy.get('[data-test="location"]').should('be.visible');
    });

    it('contains clickable org name that leads to org page', () => {
        cy.visit('/o/1/events/22');
        cy.waitUntilReactRendered();
        cy.findByText('My Organization').click();
        cy.url().should('match', /\/o\/1$/);
    });

    it('contains clickable campaign name that leads to campaign page', () => {
        cy.visit('/o/1/events/22');
        cy.waitUntilReactRendered();
        cy.findByText('Second campaign').click();
        cy.url().should('match', /\/o\/1\/campaigns\/2$/);
    });

    it('contains a sign-up button', () => {
        cy.visit('/o/1/events/22');
        cy.findByText('Sign-up').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};