describe('/o/[orgId]/events/[eventId]', () => {
    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains non-interactive event content', () => {
        cy.visit('/o/1/events/25');
        cy.get('[data-testid="event-title"]').should('be.visible');
        cy.get('[data-testid="duration"]').should('be.visible');
        cy.get('[data-testid="location"]').should('be.visible');
    });

    it('contains clickable org name that leads to org page', () => {
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('My Organization').click();
        cy.url().should('match', /\/o\/1$/);
    });

    it('contains clickable campaign name that leads to campaign page', () => {
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('Second campaign').click();
        cy.url().should('match', /\/o\/1\/campaigns\/2$/);
    });

    it('shows a sign-up button if user is not signed up to the event', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();

        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('Sign-up').click();
        //TODO: Verify that API request is done corrently.
    });

    it('shows an undo sign-up button if user is signed up to the event', () => {
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

            cy.visit('/o/1/events/25');
            cy.waitUntilReactRendered();
            cy.findByText('Undo sign-up').click();
            //TODO: Verify that API request is done corrently.
        });
    });
});

// Hack to flag for typescript as module
export {};