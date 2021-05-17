import { ZetkinEvent, ZetkinMembership } from '../../src/types/zetkin';

describe('/my', () => {
    let dummyEvents : {data: ZetkinEvent[]};
    let dummyFollowing : {data: ZetkinMembership[]};

    before(() => {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data;
            });
        cy.fixture('dummyFollowing.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyFollowing = data;
            });
    });

    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains events', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: dummyFollowing,
            },
        });

        dummyEvents.data[0].start_time = Date();

        cy.login();

        cy.visit('/my');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/1"]').should('have.length', 1);
    });

    it('contains tabs for time filtering', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/actions/_mocks/get', {
            response: {
                data: dummyEvents,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: dummyFollowing,
            },
        });

        dummyEvents.data[0].start_time = Date();

        cy.login();

        cy.visit('/my');
        cy.waitUntilReactRendered();
        cy.contains('Today');
    });

    it('contains a placeholder if there is no content', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: [],
            },
        });

        cy.login();

        cy.visit('/my');
        cy.contains('Sorry, there is nothing planned at the moment.');
    });

});

// Hack to flag for typescript as module
export {};