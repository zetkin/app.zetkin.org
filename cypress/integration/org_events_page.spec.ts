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
            cy.intercept({
                method: 'GET',
                url: /\/api\/orgs\/1\/campaigns\/941\/actions$/,
            }, {
                data: [
                    {
                        id: 1,
                        title: 'Mocked event',
                        campaign: {
                            title: 'Mocked campaign'
                        },
                        start_time: '0000 00 00, 00:00',
                        end_time: '1111 11 11, 11:11',
                        location: {
                            title: 'Mocked location'
                        }
                    },
                ]
            });
             //finns en eventlista? innehåller det de events jag hämtar?
            cy.visit('/o/1/events');
            cy.get('[data-test="event-list"]>li').should('be.visible');
        });
});
// Hack to flag for typescript as module
export {};
