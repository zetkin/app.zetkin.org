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

    it('contains name of organization', () => {
        cy.visit('/o/1/events');
        cy.contains('Mocked org');
    });
});

// Hack to flag for typescript as module
export {};
