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
});
    
// Hack to flag for typescript as module
export {};