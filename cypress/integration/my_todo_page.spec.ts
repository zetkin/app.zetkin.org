import { ZetkinEvent, ZetkinEventResponse, ZetkinMembership } from '../../src/types/zetkin';

describe('/my/todo', () => {
    let dummyEventResponses : {data: ZetkinEventResponse[]};
    let dummyBookedEvents : {data: ZetkinEvent[]};
    let dummyEvents : {data: ZetkinEvent[]};
    let dummyMemberships : {data: ZetkinMembership[]};

    before(() => {
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyBookedEvents = data;
            });
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data;
            });
        cy.fixture('dummyMemberships.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyMemberships = data;
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

        cy.request('put', 'http://localhost:8001/v1/users/me/actions/_mocks/get', {
            response: {
                data: { data: [] },
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/memberships/_mocks/get', {
            response: {
                data: dummyMemberships,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        dummyEventResponses.data[0].action_id = 1;
        dummyEvents.data[0].id = 1;
        dummyEvents.data[0].start_time = Date();

        cy.login();

        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.findByText('Undo sign-up').should('have.length', 1);
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

    it('contains a tabs menu', () => {
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

        cy.request('put', 'http://localhost:8001/v1/users/me/memberships/_mocks/get', {
            response: {
                data: dummyMemberships,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        dummyEventResponses.data[0].action_id = 1;
        dummyBookedEvents.data[0].id = 1;
        dummyEvents.data[0].id = 1;
        dummyEvents.data[0].start_time = Date();

        cy.login();

        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.contains('Today');
    });
});

// Hack to flag for typescript as module
export {};
