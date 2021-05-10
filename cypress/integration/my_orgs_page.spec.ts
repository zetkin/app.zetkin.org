import { ZetkinMembership } from '../../src/types/zetkin';

describe('/my/orgs', () => {
    let dummyMemberships : {data: ZetkinMembership[]};

    before(() => {
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

    it('contains membership orgs', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/memberships/_mocks/get', {
            response: {
                data: dummyMemberships,
            },
        });

        cy.login();

        cy.visit('/my/orgs');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/"]').should('have.length', 1);
    });

    it('contains a placeholder if there are no memberships', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/memberships/_mocks/get', {
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
});

// Hack to flag for typescript as module
export {};
