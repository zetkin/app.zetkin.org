describe('/o/[orgId]/events', () => {

        it('contains name of organization', () => {
            cy.intercept('GET', /\/api\/orgs\/1$/, { fixture: 'dummyOrg' });
            cy.visit('/o/1/events');
            cy.contains('Mocked org');
        });

        it('contains an event-list with existing events', () => {
            cy.visit('/o/1/events');
            cy.get('[data-test="event-list"]>[data-test="event"]').should('be.visible');
        });

        it('contains placeholder if there are no events', () => {
            cy.fixture('dummyEvents.json').then((dummyEvents)  => {
                dummyEvents.data = [];
                cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941\/actions$/, dummyEvents);
            })
            cy.visit('/o/1/events');
            cy.contains('Sorry, there are no planned events at the moment.');
        });

});
// Hack to flag for typescript as module
export {};
