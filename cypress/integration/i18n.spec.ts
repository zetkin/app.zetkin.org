describe('Internationalization', () => {
    const EXPECTED_ENGLISH = 'This will become Zetkin';
    const EXPECTED_SWEDISH = 'Detta kommer att bli Zetkin';

    it('Uses language from Accept-Language header', () => {
        // English
        cy.visit('/', {
            headers: {
                'Accept-Language': 'en',
            },
        });
        cy.contains(EXPECTED_ENGLISH);

        // Swedish
        cy.visit('/', {
            headers: {
                'Accept-Language': 'sv',
            },
        });
        cy.contains(EXPECTED_SWEDISH);
    });

    it('Falls back to English', () => {
        // Latin (falls back to English)
        cy.visit('/', {
            headers: {
                'Accept-Language': 'la',
            },
        });
        cy.contains(EXPECTED_ENGLISH);
    });
});

// Hack to flag for typescript as module
export {};