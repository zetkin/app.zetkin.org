describe('/o/[orgId]/events', () => {

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.contains('My Organization');
    });

    xit('contains events which are linked to event pages', () => {
        // TODO: Figure out why this fails on GitHub
        cy.visit('/o/1/events');
        cy.get('[data-test="event"]').should('be.visible');
        cy.get('[data-test="more-info-button-22"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /\/o\/1\/events\/[0-9]+$/);
    });

    xit('contains a placeholder if there are no events', () => {
        // TODO: Figure out why this fails on GitHub
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, { data: [] });

        cy.visit('/o/1/events');
        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};
