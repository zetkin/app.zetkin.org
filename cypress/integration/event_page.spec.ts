import { ZetkinEvent, ZetkinEventResponse } from '../../src/types/zetkin';

describe.skip('/o/[orgId]/events/[eventId]', () => {
    let dummyBookedEvents : {data: ZetkinEvent[]};
    let dummyEventResponses : {data: ZetkinEventResponse[]};
    let dummyEvents : {data: ZetkinEvent[]};

    before(() => {
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data;
            });
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data;
            });
    });

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
        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/actions/_mocks/get', {
            response: {
                data: dummyBookedEvents,
            },
        });

        dummyEvents.data[0].id = 25;
        dummyEventResponses.data[0].action_id = 1;
        dummyBookedEvents.data[0].id = 1;

        cy.login();

        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.findByText('Sign-up').click();
        //TODO: Verify that API request is done corrently.
    });

    it('shows an undo sign-up button if user is signed up to the event', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/25/responses/2/_mocks/delete', {
            response: {
                status: 204,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/actions/_mocks/get', {
            response: {
                data: dummyBookedEvents,
            },
        });

        dummyEvents.data[0].id = 26;
        dummyEventResponses.data[0].action_id = 26;
        dummyBookedEvents.data[0].id = 1;

        cy.login();

        cy.visit('/o/1/events/26');
        cy.waitUntilReactRendered();
        cy.findByText('Undo sign-up').click();
        //TODO: Verify that API request is done corrently.
    });

    it('contains an indicator that the user has been booked for the event', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/25/responses/2/_mocks/delete', {
            response: {
                status: 204,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/actions/_mocks/get', {
            response: {
                data: dummyBookedEvents,
            },
        });

        dummyEvents.data[0].id = 26;
        dummyEventResponses.data[0].action_id = 1;
        dummyBookedEvents.data[0].id = 26;

        cy.login();

        cy.visit('/o/1/events/26');
        cy.waitUntilReactRendered();
        cy.contains('Booked');
    });

    it('contains a map with marker that shows title of event when clicked', () => {
        cy.visit('/o/1/events/25');
        cy.waitUntilReactRendered();
        cy.get('.leaflet-container').should('be.visible');
        cy.get('.leaflet-marker-icon').should('be.visible').click().then(() => {
            cy.get('.leaflet-popup-content')
                .should('be.visible')
                .should('contain.text', 'Haubtstrasse');
        });
    });
});

// Hack to flag for typescript as module
export {};
