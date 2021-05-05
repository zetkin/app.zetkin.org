/* eslint-disable no-undef */
require('@cypress/react/support');
require('@testing-library/cypress/add-commands');

const SESSION_ID = 'sid';

Cypress.Commands.add('waitUntilReactRendered', (timeout = 10000) => {
    cy.window().its('__reactRendered', { timeout }).then(initialized => {
        return initialized;
    });
});

Cypress.Commands.add('waitUntilReactRendered', (timeout = 10000) => {
    cy.window().its('__reactRendered', { timeout }).then(initialized => {
        return initialized;
    });
});

Cypress.Commands.add('loginFromRedirect', () => {
    cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com', {delay: 0});
    cy.get('input[aria-label="Password"]').type('password', {delay: 0});
    cy.get('input[aria-label="Log in"]')
        .should('be.visible')
        .click();
})

Cypress.Commands.add('login', () => {
    Cypress.Cookies.preserveOnce(SESSION_ID);

    cy.getCookie(SESSION_ID).then(cookie => {
        if (!cookie) {
            cy.visit('/login')
            cy.fillLoginForm()
        } else {
            cy.getCookie(SESSION_ID).should('have.property', 'value')
        }
    })
})

Cypress.Commands.add('fillLoginForm', () => {
    cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
            cy.get('input[aria-label="Password"]').type('password');
            cy.get('input[aria-label="Log in"]')
                .should('be.visible')
                .click();
})