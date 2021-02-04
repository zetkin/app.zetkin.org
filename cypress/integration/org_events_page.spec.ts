describe('/o/[orgId]/events', () => {

        it('contains name of organization', () => {
            cy.intercept({
                method: 'GET',
                url: /\/api\/orgs\/1$/,
            }, {
                data: {
                    id: 1,
                    title: 'Mocked org',
                },
            });
            cy.visit('/o/1/events');
            cy.contains('Mocked org');
        });

        it('contains an event-list with existing events', () => {
            cy.visit('/o/1/events');
            cy.get('[data-test="event-list"]>[data-test="event"]').should('be.visible');
        });

        it('contains placeholder if there are no events', () => {
            cy.intercept({
                method: 'GET',
                url: /\/api\/orgs\/1\/campaigns\/941\/actions$/,
            }, {
                data: []
            });
            cy.visit('/o/1/events');
            cy.contains('Sorry, there are no planned events at the moment.');
        });

});
// Hack to flag for typescript as module
export {};
