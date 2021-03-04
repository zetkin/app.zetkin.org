describe('Login process', () => {
    it('contains a login button which leads to the login page', () => {
        cy.visit('/');
        cy.get('[data-test="login-button"]').should('be.visible').click();
        cy.url().should('match', /http:\/\/login.dev.zetkin.org\/./);
    });

    it('contains a login form where you can login and see your details', () => {
        cy.visit('/login');
        cy.get('.LoginForm-emailInput').type('testadmin@example.com');
        cy.get('.LoginForm-passwordInput').type('password');
        cy.get('.LoginForm-submitButton').should('be.visible').click();
        cy.url().should('match', /\/$/);
        cy.visit('/my');
    });
});
    
// Hack to flag for typescript as module
export {};