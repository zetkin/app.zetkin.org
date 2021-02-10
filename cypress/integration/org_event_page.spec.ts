describe('/o/[orgId]/events/[eventId]', () => {
    let dummyEvents;
    let dummyOrg;

    beforeEach(() => {
        cy.fixture('dummyEvents.json')
            .then((data) => {
                dummyEvents = data;
            });
        cy.fixture('dummyOrg.json')
            .then((data) => {
                dummyOrg = data;
            });
    });

    it('contains non-interactive event content', () => {
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, dummyEvents);

        cy.visit('/o/1/events/16831');
        cy.get('[data-test="event-title"]').should('be.visible');
        cy.get('[data-test="start-time"]').should('be.visible');
        cy.get('[data-test="end-time"]').should('be.visible');
        cy.get('[data-test="info-text"]').should('be.visible');
        cy.get('[data-test="location"]').should('be.visible');
    });

    it('contains clickable org name that leads to org page', () => {
        cy.intercept('GET', /\/api\/orgs\/1$/, dummyOrg);

        cy.visit('/o/1/events/16831');
        cy.contains(dummyOrg.data.title).click();
        cy.url().should('eq', `http://localhost:3000/o/${dummyOrg.data.id}`);
    });

    it('contains clickable campaign name that leads to campaign page', () => {
        cy.intercept('GET', /\/api\/orgs\/1\/campaigns\/[0-9]+\/actions$/, dummyEvents);

        cy.visit('/o/1/events/16831');
        cy.contains(dummyEvents.data[0].campaign.title).click();
        cy.url().should('eq', `http://localhost:3000/o/1/campaigns/${dummyEvents.data[0].campaign.id}`);
    });
});

// Hack to flag for typescript as module
export {};