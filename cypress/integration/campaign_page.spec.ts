describe('/o/[orgId]/campaigns/[campId]', () => {

    it('contains campaign content', () => {
        cy.visit('/o/1/campaigns/2');
        cy.contains('Second campaign');
    });

    it('contains campaign events', () => {
        cy.visit('/o/1/campaigns/2');
        cy.get('[data-testid="event"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};
