describe('404 Page', () => {
    const BAD_PATH = '/bad_path';
    const EXPECTED_ENGLISH = '404 | Page not found';

    it('loads custom 404 page on response status 404, and links back to the home page', () => {
        cy.request({
            failOnStatusCode: false,
            url: BAD_PATH,
        }).then(res => {
            expect(res.status).equal(404);
        });
        cy.visit(BAD_PATH, { failOnStatusCode: false });
        cy.contains(EXPECTED_ENGLISH);
        cy.get('[data-testid="back-home-link"]')
            .should('be.visible')
            .click();
        cy.url().should('match', /http:\/\/www\.dev\.zetkin\.org\//);
    });
});

// Hack to flag for typescript as module
export {};