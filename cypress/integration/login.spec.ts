describe('Login process', () => {
    it('contains a login button which leads to the login page', () => {
        cy.visit('/');
        cy.get('[data-testid="login-button"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /http:\/\/login\.dev\.zetkin\.org\//);
    });

    it('contains a login form where you can login and see your details', () => {
        cy.visit('/login');
        cy.fillLoginForm();
        cy.url().should('match', /\/$/);
        cy.get('[data-testid="username"]').should('be.visible');
        cy.get('[data-testid="user-avatar"]').should('be.visible');
    });

    it('takes you to My Page when clicking on user avatar', () => {
        cy.visit('/login');
        cy.fillLoginForm();
        cy.waitUntilReactRendered();
        cy.get('[data-testid="username"]').click();
        cy.url().should('match', /\/my$/);
    });

    it('redirects from /my to login when not already logged in', () => {
        cy.visit('/my');
        cy.url().should('match', /login.dev.zetkin.org/);
    });

    it('redirects to tried page after logging in', () => {
        cy.visit('/my');
        cy.fillLoginForm();
        cy.url().should('match', /\/my$/);
    });

    it('contains a logout button wich logs you out and takes you back to the home page', () => {
        cy.visit('/login');
        cy.fillLoginForm();
        cy.getCookie('sid')
            .should('have.property', 'value')
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
