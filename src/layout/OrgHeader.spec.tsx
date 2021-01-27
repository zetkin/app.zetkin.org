import * as nextRouter from 'next/router';
import { mount } from '@cypress/react';

import OrgHeader from './OrgHeader';

describe('OrgHeader', () => {
    const dummyOrg = {
        id: 1,
        title: 'My org'
    };

    beforeEach(() => {
        cy.stub(nextRouter, 'useRouter', () => ({
            prefetch: () => Promise.resolve(null),
        }));
    });

    it('contains org title', () => {
        mount(<OrgHeader org={ dummyOrg }/>);
        cy.contains(dummyOrg.title);
    });

    it('contains org logo', () => {
        mount(<OrgHeader org={ dummyOrg }/>);
        cy.get('img').should('have.attr', 'src', 'https://api.zetk.in/v1/orgs/1/avatar');
    });

    it('contains functional edit link', () => {
        mount(<OrgHeader org={ dummyOrg }/>);
        cy.contains('Edit Page');
    });

    it('has an unfollow button when logged in', () => {
        mount(<OrgHeader org={ dummyOrg } loggedIn={ true }/>);
        cy.get('button').should('be.visible');
    });

    it('has no unfollow button when not logged in', () => {
        mount(<OrgHeader org={ dummyOrg } loggedIn={ false }/>);
        cy.get('button').should('not.exist');
    });
});