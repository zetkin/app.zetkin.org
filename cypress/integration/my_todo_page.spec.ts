import { ZetkinEvent, ZetkinEventResponse } from '../../src/types/zetkin';

describe('/my/todo', () => {
    let dummyEventResponses : {data: ZetkinEventResponse[]};
    let dummyBookedEvents : {data: ZetkinEvent[]};

    before(() => {
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data;
            });
    });

    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains event responses', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.login();

        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/1/events"]').should('have.length', 1);
    });

    it('contains booked events', () => {
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

        cy.login();

        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.get('[data-testid="booked"]').should('have.length', 1);
    });

    it('contains a placeholder if there are neither call assignments nor respond-events', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/call_assignments/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.login();

        cy.visit('/my/todo');
        cy.contains('You have nothing planned at the moment.');
    });
});

// Hack to flag for typescript as module
export {};
