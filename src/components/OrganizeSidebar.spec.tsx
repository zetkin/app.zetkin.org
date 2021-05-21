import * as Router from 'next/router';

import { mountWithProviders } from '../utils/testing';
import OrganizeSidebar from './OrganizeSidebar';

describe('OrganizeSidebar', () => {
    const dummyOrgId= '1';

    it('contains navigation buttons', () => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]` };
        });

        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="home-button"]').should('be.visible');
        cy.get('[data-test="people-button"]').should('be.visible');
        cy.get('[data-test="area-button"]').should('be.visible');
        cy.get('[data-test="calendar-button"]').should('be.visible');
        cy.get('[data-test="inbox-button"]').should('be.visible');
        cy.get('[data-test="user-button"]').should('be.visible');
    });

    it('disables people button when on the people page', () => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]/people` };
        });

        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="people-button"]').should('be.disabled');
    });

    it('disables map button when on the areas page', () => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]/areas` };
        });

        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="area-button"]').should('be.disabled');
    });

    it('disables calendar button when on the calendar page', () => {
        cy.stub(Router, 'useRouter').callsFake(() => {
            return { pathname: `/organize/[orgId]/campaigns/calendar` };
        });

        mountWithProviders(<OrganizeSidebar orgId={ dummyOrgId }/>);
        cy.get('[data-test="calendar-button"]').should('be.disabled');
    });
});
