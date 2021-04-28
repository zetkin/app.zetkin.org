describe('/users/my/todo', () => {
    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains todo events which are linked to event pages', () => {
        cy.fixture('dummyEventResponses').then(json => {
            cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
                response: {
                    data: json,
                },
            });

            cy.visit('/login');
            cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
            cy.get('input[aria-label="Password"]').type('password');
            cy.get('input[aria-label="Log in"]')
                .click();
            cy.visit('/my/todo');
            cy.waitUntilReactRendered();
            cy.get('[data-testid="event"]')
                .eq(0)
                .findByText('More info')
                .click();
            cy.url().should('match', new RegExp(`/o/1/events/${json.data[0].action_id}$`));
        });
    });

    it('shows an undo sign-up button for todo events', () => {
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

            cy.visit('/login');
            cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
            cy.get('input[aria-label="Password"]').type('password');
            cy.get('input[aria-label="Log in"]')
                .click();

            cy.visit('/my/todo');
            cy.waitUntilReactRendered();
            cy.findByText('Undo sign-up').click();
            //TODO: Verify that API request is done corrently.
        });
    });
});

// Hack to flag for typescript as module
export {};
