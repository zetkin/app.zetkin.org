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

        cy.visit('/o/1/events');
        cy.get('[data-test="no-events-placeholder"]').should('be.visible');
    });

    it.only('shows sign up button if not signed up, and undo button when signed up', () => {
        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();
        cy.visit('/o/1/events');
        cy.waitUntilReactRendered();
        cy.get('[data-test="event-response-button"]')
            .eq(5)
            .contains('Sign-up')
            .click();
        cy.waitUntilReactRendered();
        cy.get('[data-test="event-response-button"]')
            .eq(5)
            .contains('Undo sign-up');
    });
});

// Hack to flag for typescript as module
export {};
