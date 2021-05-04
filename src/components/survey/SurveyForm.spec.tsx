import { mountWithProviders } from '../../utils/testing';
import SurveyForm from '../../pages/o/[orgId]/surveys/SurveyForm';

describe('SurveyForm', () => {
    it('renders header and info_text', () => {
        const dummySurvey = {
            elements: [],
            info_text: 'My description',
            title: 'My Survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey }/>);

        cy.contains(dummySurvey.title);
        cy.contains(dummySurvey.info_text);
    });

    it('renders a text block with header and content', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    text_block: {
                        content: 'This is the content of the text block',
                        header: 'Text block header',
                    },
                    type: 'text',
                },
            ],
            info_text: 'My description',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="textblock-header"]').should('be.visible');
        cy.get('[data-testid="textblock-content"]').should('be.visible');
    });
});
