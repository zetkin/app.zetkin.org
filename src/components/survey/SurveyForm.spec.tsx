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
        type TextType = 'text';

        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    text_block: {
                        content: 'This is the content of the text block',
                        header: 'Text block header',
                    },
                    type: 'text' as TextType,
                },
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="textblock-header"]').should('be.visible');
        cy.get('[data-testid="textblock-content"]').should('be.visible');
    });


    it('renders a question with description', () => {
        type QuestionType = 'question';

        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        description: 'Here is the description of the question.',
                        question: 'This is a question?',
                    },
                    type: 'question' as QuestionType,
                },
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="question"]').should('be.visible');
        cy.get('[data-testid="question-description"]').should('be.visible');

    });

    it('renders a question with single line text input', () => {
        type QuestionType = 'question';

        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        question: 'This is a question?',
                    },
                    type: 'question' as QuestionType,
                },
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="question"]').should('be.visible');
        cy.get('[data-testid="response"]').should('be.visible');
    });

});
