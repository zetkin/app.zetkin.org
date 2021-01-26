describe('/o/[orgId]/events', () => {
    beforeEach(() => {
        cy.intercept({
            method: 'GET',
            url: /\/api\/orgs\/1$/,
        }, {
            data: {
                id: 1,
                title: 'Mocked org',
            },
        });
    });

    it('contains header content', () => {
        cy.visit('/o/1/events');
        cy.get('figure')
        cy.get('h1').should('contain', 'Mocked org');
        cy.get('img').should('be.visible')
        cy.get('figure')
            .should('have.css', 'background')
            .and('include','cover.jpg');
    });

    it('input text', () => {
        cy.get('.input')
        .type('Hello Bredäng')
        .should('have.value', 'Hello Bredäng');
    });

    it('click to edit page', () => {
        cy.contains('Edit Page').click();
        cy.url().should('include', '/');
        cy.contains('This will become Zetkin');
    });

});

// Hack to flag for typescript as module
export {};
