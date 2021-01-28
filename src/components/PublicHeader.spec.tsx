import { mount } from '@cypress/react';

import PublicHeader from './PublicHeader';

describe('PublicHeader', () => {

    const userData = {
        avatar: 'https://api.zetk.in/v1/orgs/1/avatar',
        first_name: 'Firstname',
        id: 1,
        last_name: 'Lastname'
    };

    it('contains a login button when not logged in', () => {
        mount(<PublicHeader userData={ null }/>);
        cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('contains no login button when logged in', () => {
        mount(<PublicHeader userData={ userData }/>);
        cy.get('[data-test="login-button"]').should('not.exist');
    });

    it('contains user name if logged in', () => {
        mount(<PublicHeader userData={ userData }/>);
        cy.contains(`${userData.first_name} ${userData.last_name}`);
    });

    it('contains user avatar if logged in', () => {
        mount(<PublicHeader userData={ userData }/>);
        cy.get('[data-test="user-avatar"]').should('be.visible');
    });
}); 