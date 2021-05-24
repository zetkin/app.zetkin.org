import { ZetkinCampaign, ZetkinEvent, ZetkinMembership } from '../../src/types/zetkin';

describe('/my', () => {
    let dummyEvents : {data: ZetkinEvent[]};
    let dummyFollowing : {data: ZetkinMembership[]};
    let dummyCampaigns : {data: ZetkinCampaign[]};

    const date = new Date();

    before(() => {
        cy.fixture('dummyEvents.json')
            .then((data : {data: ZetkinEvent[]}) => {
                dummyEvents = data;
            });
        cy.fixture('dummyFollowing.json')
            .then((data : {data: ZetkinMembership[]}) => {
                dummyFollowing = data;
            });
        cy.fixture('dummyCampaigns.json')
            .then((data : {data: ZetkinCampaign[]}) => {
                dummyCampaigns = data;
            });
    });

    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains event previews', () => {
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

        dummyEvents.data[0].start_time = date.toISOString();

        cy.login();

        cy.visit('/my');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/1/events/"]').should('have.length', 1);
    });

    it('contains a tabs menu', () => {
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

        dummyEvents.data[0].start_time = date.toISOString();

        cy.login();

        cy.visit('/my');
        cy.waitUntilReactRendered();
        cy.contains('Today');
    });

    it('contains a placeholder for all content if there are no events', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: [],
            },
        });

        cy.login();

        cy.visit('/my');
        cy.contains('Sorry, there is nothing planned at the moment.');
    });

    it('contains campaign links', () => {
        cy.request('put', 'http://localhost:8001/v1/orgs/1/campaigns/_mocks/get', {
            response: {
                data: dummyCampaigns,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: dummyFollowing,
            },
        });

        cy.login();

        cy.visit('/my');
        cy.waitUntilReactRendered();
        cy.get('[data-testid="campaign-link"]').should('have.length', 1);
    });

});

// Hack to flag for typescript as module
export {};