describe('/o/[orgId]/campaigns/[campId]', () => {
    beforeEach(() => {
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941\/actions$/, { fixture: 'dummyEvents' });
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941$/, { fixture: 'dummyCampaign' });
    });

        it('contains a campaign title', () => {
            cy.visit('/o/1/campaigns/941');
            cy.get('[data-test="campaign-heading"]').should('be.visible');
        });

        it('contains campaign information', () => {
            cy.visit('/o/1/campaigns/941');
            cy.get('[data-test="campaign-information"]').should('be.visible');
        });

        it('contains campaign events', () => {
            cy.visit('/o/1/campaigns/941');
            cy.get('[data-test="event"]').should('be.visible');
        });
});
// Hack to flag for typescript as module
export {};
