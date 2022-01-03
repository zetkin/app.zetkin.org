import { render } from 'test-utils';

import SurveyResponseViewCell, { SurveyResponseViewCellParams } from './SurveyResponseViewCell';


describe('SurveyResponseViewCell', () => {
    const mockParams = (overrides?: Partial<SurveyResponseViewCellParams>) => {
        return {
            value: null,
            ...overrides,
        } as SurveyResponseViewCellParams;
    };

    it('renders empty when content is null', () => {
        const params = mockParams();
        const { baseElement } = render(
            <SurveyResponseViewCell params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders response when at least one exists', () => {
        const params = mockParams({
            value: [{
                submission_id: 1,
                text: 'This is the response',
            }],
        });
        const { getByText } = render(
            <SurveyResponseViewCell params={ params }/>,
        );
        getByText('This is the response');
    });

    it('renders pop-over with responses', () => {
        const params = mockParams({
            value: [
                { submission_id: 1, text: 'This is the response' },
                { submission_id: 2, text: 'This is another response' },
            ],
        });
        const { getByText } = render(
            <SurveyResponseViewCell params={ params }/>,
        );
        getByText('This is the response').click();
        getByText('This is another response');
    });
});
