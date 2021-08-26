/* eslint-disable no-undef */
require('@cypress/react/support');
require('@testing-library/cypress/add-commands');
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

Cypress.Commands.add('waitUntilReactRendered', (timeout = 10000) => {
    cy.window().its('__reactRendered', { timeout }).then(initialized => {
        return initialized;
    });
});

Cypress.Commands.add('login', () => {
    // Request the login route which will redirect to login page
    cy.request('/login').then(res => {
        // Find the URL to which we were redirected
        const redirect = res.redirects.pop();
        const loginUri = redirect.split(' ')[1];

        // Parse login page HTML to find the session data in form field
        const $html = Cypress.$(res.body);
        const session = $html.find('input[name=session]').val();

        // Simulate posting the form, including credentials and session data
        cy.request({
            body: {
                email: 'testadmin@example.com',
                password: 'password',
                session: session,
            },
            form: true,
            method: 'POST',
            url: loginUri,
        });
    });
});

Cypress.Commands.add('fillLoginForm', () => {
    cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
    cy.get('input[aria-label="Password"]').type('password');
    cy.get('input[aria-label="Log in"]')
        .should('be.visible')
        .click();
});
