/* eslint-disable no-undef */
require('@cypress/react/support');
require('@testing-library/cypress/add-commands');

Cypress.Commands.add('waitUntilReactRendered', (timeout = 10000) => {
    cy.window().its('__reactRendered', { timeout }).then(initialized => {
        return initialized;
    });
});