describe('/o/[orgId]/events', () => {
    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.waitUntilReactRendered();
        cy.contains('My Organization');
    });

    it('contains events which are linked to event pages', () => {
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
            cy.get('[data-testid="event"]')
                .eq(0)
                .findByText('More info')
                .click();
            cy.url().should('match', new RegExp(`/o/1/events/${json.data[0].id}$`));
        });
    });

    it('contains a placeholder if there are no events', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/campaigns/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.visit('/o/1/events');
        cy.get('[data-testid="no-events-placeholder"]').should('be.visible');
    });

    it('shows a sign-up button if user is not signed up to an event', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.login();

        cy.visit('/o/1/events');
        cy.waitUntilReactRendered();
        cy.get('[data-testid="event-response-button"]')
            .eq(4)
            .click();
        //TODO: Verify that API request is done corrently.
    });

    it('shows an undo sign-up button if user is signed up to an event', () => {
        cy.fixture('dummyEventResponses').then(json => {
            cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
                response: {
                    data: json,
                },
            });

            cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/25/responses/2/_mocks/delete', {
                response: {
                    status: 204,
                },
            });

            cy.login();

            cy.visit('/o/1/events');
            cy.waitUntilReactRendered();
            cy.findByText('Undo sign-up').click();
            //TODO: Verify that API request is done corrently.
        });
    });
});

// Hack to flag for typescript as module
export {};
