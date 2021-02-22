describe('/o/[orgId]/events', () => {

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.contains('My Organization');
    });

    xit('contains events', () => {
        // TODO: Figure out why this fails on GitHub
        cy.visit('/o/1/events');
        cy.get('[data-test="event"]').should('be.visible');
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
