/* eslint-disable no-undef */
require('@cypress/react/support');
require('@testing-library/cypress/add-commands');

const COOKIE_NAME = 'sid';

Cypress.Commands.add('waitUntilReactRendered', (timeout = 10000) => {
    cy.window().its('__reactRendered', { timeout }).then(initialized => {
        return initialized;
    });
});

Cypress.Commands.add('login', () => {
    Cypress.Cookies.preserveOnce(COOKIE_NAME);

    cy.getCookie(COOKIE_NAME).then(cookie => {
        if (!cookie) {
            cy.visit('/login');
            cy.fillLoginForm();
        }
        else {
            cy.getCookie(COOKIE_NAME).should('have.property', 'value');
        }
    });
});

Cypress.Commands.add('fillLoginForm', () => {
    cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('input[aria-label="Log in"]')
        .should('be.visible')
        .click();
});