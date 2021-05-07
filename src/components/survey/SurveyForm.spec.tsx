import { mountWithProviders } from '../../utils/testing';
import SurveyForm from '../../pages/o/[orgId]/surveys/SurveyForm';
import {
    ZetkinSurveyQuestionElement,
    ZetkinSurveyTextblockElement,
} from '../../types/zetkin';

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
                } as ZetkinSurveyTextblockElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="textblock-header"]').should('be.visible');
        cy.get('[data-testid="textblock-content"]').should('be.visible');
    });


    it('renders a question with description', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        description: 'Here is the description of the question.',
                        question: 'This is a question?',
                        response_config: {
                            multiline: false,
                        },
                        response_type: 'text',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="question"]').should('be.visible');
        cy.get('[data-testid="question-description"]').should('be.visible');

    });

    it('renders a question with single line text input', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        question: 'This is a question?',
                        response_config: {
                            multiline: false,
                        },
                        response_type: 'text',
                    },
                    type: 'question',
                }  as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="question"]').should('be.visible');
        cy.get('[data-testid="response-singleline"]').should('be.visible');
    });

    it('renders a question with a multi-line text input', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        question: 'This is a question?',
                        response_config: {
                            multiline: true,
                        },
                        response_type: 'text',
                    },
                    type: 'question',
                }  as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="response-multiline"]').should('be.visible');
    });

    it('can render a question with multiple checkbox options', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        options: [{
                            id: 1 ,
                            text: 'Option one',
                        },
                        {
                            id: 2,
                            text: 'Option two',
                        }],
                        question: 'This is a question?',
                        response_config: {
                            widget_type: 'checkbox',
                        },
                        response_type: 'options',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="response-checkbox"]').should('be.visible');
        cy.findByLabelText('Option one')
            .should('be.visible')
            .click();
        cy.get('#1-checkbox-1').should('be.checked');
        cy.findByLabelText('Option two')
            .should('be.visible')
            .click();
        cy.get('#1-checkbox-2').should('be.checked');
        cy.get('#1-checkbox-1').should('be.checked');
    });

    it('can render a question with multiple options where only one option can be checked', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        options: [{
                            id: 1 ,
                            text: 'Option one',
                        },
                        {
                            id: 2,
                            text: 'Option two',
                        }],
                        question: 'This is a question?',
                        response_config: {
                            widget_type: 'radio',
                        },
                        response_type: 'options',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="response-radio"]').should('be.visible');
        cy.findByLabelText('Option one')
            .should('be.visible')
            .click();
        cy.get('#1-radio-1').should('be.checked');
        cy.findByLabelText('Option two')
            .should('be.visible')
            .click();
        cy.get('#1-radio-2').should('be.checked');
        cy.get('#1-radio-1').should('not.be.checked');
    });

    it('can render a question with a drop-down menu of options where only one can be selected', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        options: [{
                            id: 1,
                            text: 'Option one',
                        },
                        {
                            id: 2,
                            text: 'Option two',
                        }],
                        question: 'This is a question?',
                        response_config: {
                            widget_type: 'select',
                        },
                        response_type: 'options',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="response-select"]')
            .should('be.visible')
            .select('Option one')
            .should('have.value', 'Option one');
    });

    it('can handle questions with an empty response_config object'
        + 'and default to checkbox or single line responses', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        options: [{
                            id: 1,
                            text: 'Option one',
                        },
                        {
                            id: 2,
                            text: 'Option two',
                        }],
                        question: 'This is a question?',
                        response_config: {},
                        response_type: 'options',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
                {
                    id: 2,
                    question: {
                        question: 'Is this also a question?',
                        response_config: {},
                        response_type: 'text',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="response-checkbox"]').should('be.visible');
        cy.get('[data-testid="response-singleline"]').should('be.visible');
    });

    it('signifies if a question is required', () => {
        const dummySurvey = {
            elements: [
                {
                    id: 1,
                    question: {
                        options: [{
                            id: 1,
                            text: 'Option one',
                        },
                        {
                            id: 2,
                            text: 'Option two',
                        }],
                        question: 'This is a question?',
                        required: true,
                        response_config: {
                            widget_type: 'select',
                        },
                        response_type: 'options',
                    },
                    type: 'question',
                } as ZetkinSurveyQuestionElement,
            ],
            info_text: 'My description of the survey',
            title: 'My survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey } />);

        cy.get('[data-testid="required"]').should('be.visible');
        cy.get('[data-testid="response-select"]').should('have.attr', 'required');
    });
});
