import { mountWithProviders } from '../utils/testing';
import PublicHeader from './PublicHeader';
import { ZetkinMembership, ZetkinOrganization } from '../types/zetkin';

describe('PublicHeader', () => {

    const dummyUser = {
        first_name: 'Firstname',
        id: 100,
        last_name: 'Lastname',
        username: 'Username',
    };

    const dummyMemberships = [{ organization: { id: 1 }, role: 'admin' }] as ZetkinMembership[];
    const dummyMembershipsNoOrganize = [{}] as ZetkinMembership[];

    it('contains a login button when not logged in', () => {
        mountWithProviders(<PublicHeader user={ null } userMemberships={ dummyMemberships }/>);
        cy.contains('misc.publicHeader.login');
    });

    it('contains no login button when logged in', () => {
        mountWithProviders(<PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>);
        cy.contains('misc.publicHeader.login').should('not.exist');
    });

    it('contains user name if logged in', () => {
        mountWithProviders(<PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>);
        cy.contains(`${dummyUser.first_name} ${dummyUser.last_name}`);
    });

    it('contains user avatar if logged in', () => {
        mountWithProviders(<PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>);
        cy.get('[data-testid="user-avatar"]').should('be.visible');
    });

    it('contains an organize button if user has one or more official roles', () => {
        mountWithProviders(
            <PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>,
        );
        cy.get('[data-testid="organize-button"]').should('be.visible');
    });

    it('does not contain an organize button if logged out', () => {
        mountWithProviders(<PublicHeader user={ null } userMemberships={ dummyMemberships }/>);
        cy.get('[data-testid="organize-button"]').should('not.exist');
    });

    it('does not contain an organize button if logged in and has no official roles', () => {
        mountWithProviders(
            <PublicHeader user={ dummyUser } userMemberships={ dummyMembershipsNoOrganize }/>);
        cy.get('[data-testid="organize-button"]').should('not.exist');
    });

    it('organize button leads to proper organization page', () => {
        mountWithProviders(
            <PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>,
        );
        cy.get('[data-testid="organize-link"]').should('attr', 'href', '/organize/1');
    });

    it('contains logout button if logged in', () => {
        mountWithProviders(<PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>);
        cy.get('[data-testid="logout-button"]').should('be.visible');
    });

    it('contains a zetkin logo when component has no org prop', () => {
        mountWithProviders(<PublicHeader user={ dummyUser } userMemberships={ dummyMemberships }/>);
        cy.get('[data-testid="zetkin-logotype"]').should('be.visible');
    });

    it('contains org avatar instead of zetkin logo when component has an org prop', () => {
        cy.fixture('dummyOrg.json')
            .then((data : ZetkinOrganization) => {
                mountWithProviders(<PublicHeader org={ data } user={ dummyUser } userMemberships={ dummyMemberships }/>);

                cy.get('[data-testid="zetkin-logotype"]').should('not.exist');
                cy.get('[data-testid="org-avatar"]').should('be.visible');
            });
    });
});
