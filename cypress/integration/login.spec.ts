describe('Login process', () => {
    it('contains a login button which leads to the login page', () => {
        cy.visit('/');
        cy.get('[data-test="login-button"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /http:\/\/login\.dev\.zetkin\.org\//);
    });

    it('contains a login form where you can login and see your details', () => {
        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /\/$/);
        cy.get('[data-test="username"]').should('be.visible');
        cy.get('[data-test="user-avatar"]').should('be.visible');
    });

    it('takes you to My Page when clicking on user avatar', () => {
        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]').click();
        cy.get('[data-test="username"]').click();
        cy.url().should('match', /\/my$/);
    });

    it('contains a logout button wich logs you out and takes you back to the home page', () => {
        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]').click();
        cy.getCookie('sid')
            .should('have.property', 'value')
            .then((cookie) => {
                cy.get('[data-test="logout-button"]')
                    .should('be.visible')
                    .click();
                cy.url().should('match', /\/$/);
                cy.getCookie('sid').should('not.equal', cookie?.value);
            });

    });

});
    
// Hack to flag for typescript as module
export {};
