describe('Login process', () => {
    it('contains a login button which leads to the login page', () => {
        cy.visit('/');
        cy.get('[data-testid="login-button"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /http:\/\/login\.dev\.zetkin\.org\//);
    });

    xit('takes you to My Page when clicking on user avatar', () => {
        cy.login();
        cy.visit('/');
        cy.waitUntilReactRendered();
        cy.get('[data-testid="username"]').click();
        cy.url().should('match', /\/my$/);
    });

    it('redirects from /my to login when not already logged in', () => {
        cy.visit('/my');
        cy.url().should('match', /login.dev.zetkin.org/);
    });

    xit('redirects to tried page after logging in', () => {
        // TODO: Re-enable this test once Cypress supports cross-domain navigation
        // It could also be re-implemented using cy.request() instead
        cy.visit('/my');
        cy.fillLoginForm();
        cy.url().should('match', /\/my$/);
    });

    it('contains a logout button wich logs you out and takes you back to the home page', () => {
        cy.login();
        cy.visit('/');
        cy.getCookie('sid')
            .then((cookie) => {
                cy.get('[data-testid="logout-button"]')
                    .should('be.visible')
                    .click();
                cy.url().should('match', /\/$/);
                cy.getCookie('sid').should('not.equal', cookie?.value);
            });

    });

});

// Hack to flag for typescript as module
export {};
