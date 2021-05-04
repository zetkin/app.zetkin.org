import { mountWithProviders } from '../../utils/testing';
import SurveyForm from '../../pages/o/[orgId]/surveys/SurveyForm';

describe('SurveyForm', () => {
    it('renders header and info_text', () => {
        const dummySurvey = {
            info_text: 'My description',
            title: 'My Survey',
        };

        mountWithProviders(<SurveyForm survey={ dummySurvey }/>);

        cy.contains(dummySurvey.title);
        cy.contains(dummySurvey.info_text);
    });
});
