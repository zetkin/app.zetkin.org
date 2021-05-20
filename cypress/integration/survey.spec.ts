describe('/o/[orgId]/surveys/[surId]', () => {
    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
        cy.request('delete', 'http://localhost:8001/_log');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks/');
        cy.request('delete', 'http://localhost:8001/_log/');
    });

    it('sends a POST request to the API', () => {
        cy.fixture('dummySurvey').then(json => {
            cy.request('put', 'http://localhost:8001/v1/orgs/1/surveys/1/_mocks/get', {
                response: {
                    data: {
                        data: json,
                    },
                },
            });
            cy.visit('http://localhost:3000/o/1/surveys/1');
            cy.waitUntilReactRendered();
            cy.get('[data-testid="response-singleline"]').type('This is my response');
            cy.findByLabelText('Option three').click();
            cy.get('[data-testid="submit-button"]').click();

            cy.wait(200);

            cy.request('get', 'http://localhost:8001/v1/orgs/1/surveys/1/submissions/_log')
                .then((response) => {
                    expect(response.body.log).to.have.length.above(0);
                    expect(response.body.log[0]).to.have.property('method', 'POST');
                });
        });
    });

    it('sends correct data to the API', () => {
        cy.fixture('dummySurvey').then(json => {
            cy.request('put', 'http://localhost:8001/v1/orgs/1/surveys/1/_mocks/get', {
                response: {
                    data: {
                        data: json,
                    },
                },
            });
            cy.visit('http://localhost:3000/o/1/surveys/1');
            cy.waitUntilReactRendered();
            cy.get('[data-testid="response-singleline"]').type('This is my response');
            cy.findByLabelText('Option three').click();
            cy.get('[data-testid="submit-button"]').click();

            cy.wait(200);

            cy.request('get', 'http://localhost:8001/v1/orgs/1/surveys/1/submissions/_log')
                .then((response) => {
                    expect(response.body.log[0].data.responses).to.have.lengthOf(2);
                    expect(response.body.log[0].data.responses[0]).to.have.property('question_id', 1);
                    expect(response.body.log[0].data.responses[0]).to.have.property('response', 'This is my response');
                    expect(response.body.log[0].data.responses[1]).to.have.property('question_id', 2);
                    expect(response.body.log[0].data.responses[1].options[0]).to.equal(3);
                });
        });
    });
});

// Hack to flag for typescript as module
export {};
