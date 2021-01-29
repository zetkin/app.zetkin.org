import { mount } from '@cypress/react';

import PublicHeader from './PublicHeader';

describe('PublicHeader', () => {

    const dummyUser = {
        first_name: 'Firstname',
        id: 100,
        last_name: 'Lastname'
    };

    it('contains a login button when not logged in', () => {
        mount(<PublicHeader user={ null }/>);
        cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('contains no login button when logged in', () => {
        mount(<PublicHeader user={ dummyUser }/>);
        cy.get('[data-test="login-button"]').should('not.exist');
    });

    it('contains user name if logged in', () => {
        mount(<PublicHeader user={ dummyUser }/>);
        cy.contains(`${dummyUser.first_name} ${dummyUser.last_name}`);
    });

    it('contains user avatar if logged in', () => {
        mount(<PublicHeader user={ dummyUser }/>);
        cy.get('[data-test="user-avatar"]').should('be.visible');
    });
}); 