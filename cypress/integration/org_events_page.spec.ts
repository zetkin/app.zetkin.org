describe('/o/[orgId]/events', () => {

    it('contains name of organization', () => {
        cy.intercept('GET', /\/api\/orgs\/1$/, { fixture: 'dummyOrg' });
        cy.visit('/o/1/events');
        cy.contains('Mocked org');
    });

    it('contains events', () => {
        cy.visit('/o/1/events');
        cy.get('[data-test="event"]').should('be.visible');
    });

    it('contains a placeholder if there are no events', () => {
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, { data: [] });

        cy.visit('/o/1/events');
        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};
