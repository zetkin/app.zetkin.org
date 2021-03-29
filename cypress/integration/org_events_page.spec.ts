describe('/o/[orgId]/events', () => {
    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.contains('My Organization');
    });

    it.only('contains events which are linked to event pages', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/campaigns/_mocks/get', {
            response: {
                data: {
                    data: [{
                        id: 2,
                        title: 'The campaign',
                    }],
                },
            },
        });

        cy.fixture('dummyEvents').then(json => {
            cy.request('put', 'http://localhost:8001/v1/orgs/1/campaigns/2/actions/_mocks/get', {
                response: {
                    data: json,
                },
            });

            cy.visit('/o/1/events');
            cy.waitUntilReactRendered();
            cy.get('[data-test="event"]')
                .eq(0)
                .findByText('More info')
                .click();
            cy.url().should('match', new RegExp(`/o/1/events/${json.data[0].id}$`));
        });
    });

    it('contains a placeholder if there are no events', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/campaigns/1/actions/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, { data: [] });

        cy.visit('/o/1/events');
        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};
