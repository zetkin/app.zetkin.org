describe('/o/[orgId]/events/[eventId]', () => {
    it('contains non-interactive event content', () => {
        cy.visit('/o/1/events/25');
        cy.get('[data-test="event-title"]').should('be.visible');
        cy.get('[data-test="duration"]').should('be.visible');
        cy.get('[data-test="location"]').should('be.visible');
    });

    it('contains clickable org name that leads to org page', () => {
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('My Organization').click();
        cy.url().should('match', /\/o\/1$/);
    });

    it('contains clickable campaign name that leads to campaign page', () => {
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('Second campaign').click();
        cy.url().should('match', /\/o\/1\/campaigns\/2$/);
    });

    it.only('contains a conditional sign-up button', () => {
        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('Sign-up')
            .click();
        cy.waitUntilReactRendered();
        cy.findByText('Undo sign-up');
    });
});

// Hack to flag for typescript as module
export {};