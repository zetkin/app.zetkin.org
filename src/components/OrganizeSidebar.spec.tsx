import * as Router from 'next/router';

import { mountWithProviders } from '../utils/testing';
import OrganizeSidebar from './OrganizeSidebar';

describe('OrganizeSidebar', () => {
    const dummyOrgId= '1';

    beforeEach(() => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]`, prefetch: async () => null };
        });
    });

    it('contains navigation buttons', () => {
        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="home-button"]').should('be.visible');
        cy.get('[data-test="people-button"]').should('be.visible');
        cy.get('[data-test="area-button"]').should('be.visible');
        cy.get('[data-test="calendar-button"]').should('be.visible');
        cy.get('[data-test="inbox-button"]').should('be.visible');
        cy.get('[data-test="user-button"]').should('be.visible');
    });

    it('is hidden when the viewport is narrow', () => {
        cy.viewport(500, 800);
        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="home-button"]').should('not.be.visible');
        cy.get('[data-test="people-button"]').should('not.be.visible');
        cy.get('[data-test="area-button"]').should('not.be.visible');
        cy.get('[data-test="calendar-button"]').should('not.be.visible');
    });

    it('toggles with the menu button when the viewport is narrow', () => {
        cy.viewport(500, 800);
        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="menu-button"]')
            .click()
            .then(() => {
                cy.get('[data-test="home-button"]').should('be.visible');
                cy.get('[data-test="people-button"]').should('be.visible');
                cy.get('[data-test="area-button"]').should('be.visible');
                cy.get('[data-test="calendar-button"]').should('be.visible');
            });
    });
});
