describe('/o/[orgId]/campaigns/[campId]', () => {

    it('contains campaign content', () => {
        cy.fixture('dummyCampaign.json')
            .then((dummyCampaign) => {
                cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941$/, dummyCampaign);

                cy.visit('/o/1/campaigns/941');
                cy.contains(`${dummyCampaign.data.title}`);
                cy.contains(`${dummyCampaign.data.info_text.substring(0, 50)}`);
            });
    });

    it('contains campaign events', () => {
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/941\/actions$/, { fixture: 'dummyEvents' });

        cy.visit('/o/1/campaigns/941');
        cy.get('[data-test="event"]').should('be.visible');
    });
});

// Hack to flag for typescript as module
export {};
