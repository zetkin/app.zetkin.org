describe('/o/[orgId]/events', () => {

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.contains('My Organization');
    });

    xit('contains events which are linked to event pages', () => {
        // TODO: Figure out why this fails on GitHub
        cy.visit('/o/1/events');
        cy.get('[data-test="event"]')
            .eq(1)
            .findByText('More info')
            .click();
        cy.url().should('match', /\/o\/1\/events\/22$/);
    });

    xit('contains a placeholder if there are no events', () => {
        // TODO: Figure out why this fails on GitHub
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, { data: [] });

        cy.visit('/o/1/events');
        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });

    //TODO: Figure out how to make this work. Requires login?
    xit('contains conditional sign-up/undo sign-up button functionality for event sign-up', () => {
        cy.visit('/o/1/events');
        cy.get('[data-test="sign-up-button"]')
            .eq(5)
            .contains('Sign-up')
            .click()
            .contains('Undo sign-up');
    });
});

// Hack to flag for typescript as module
export {};
