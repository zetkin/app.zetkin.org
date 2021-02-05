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
            cy.fixture('dummyEvents.json').then((dummyEvents)  => {
                dummyEvents.data = [];
                cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941\/actions$/, dummyEvents);
            })
            cy.visit('/o/1/events');
            cy.get('[data-test="no-events-placeholder"]').should('be.visible');
        });

});
// Hack to flag for typescript as module
export {};
