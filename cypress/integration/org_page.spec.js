describe('Organization Page', () => {
    it('Contains the title of the organization', () => {
        const dummyOrg = {
            data: {
                id: 1,
                title: 'This is the organization title',
            }
        };
        cy.intercept({
            method: 'GET',
            url: '/api/orgs/1',
        }, dummyOrg);

        cy.visit('/o/1/events');
        cy.contains(dummyOrg.data.title);
    });

    it('Contains the org logo', () => {
        cy.visit('/o/1/events');
        cy.get('[data-test=org-logo]').should('have.attr', 'src', '/api/orgs/1/avatar');
    });
});
