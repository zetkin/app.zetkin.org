import { ZetkinMembership } from '../../src/types/zetkin';

describe('/my/orgs', () => {
    let dummyFollowing : {data: ZetkinMembership[]};

    before(() => {
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

    it('contains followed organizations', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: dummyFollowing,
            },
        });

        cy.login();

        cy.visit('/my/orgs');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/"]').should('have.length', 1);
    });

    it('contains a placeholder if there are no followed organizations', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.login();

        cy.visit('/my/orgs');
        cy.contains('You are not connected to any organizations yet.');
    });

    it('contains an unfollow button for each organization', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/following/_mocks/get', {
            response: {
                data: dummyFollowing,
            },
        });

        cy.login();

        cy.visit('/my/orgs');
        cy.contains('Unfollow');
    });
});

// Hack to flag for typescript as module
export {};
