import { render } from 'test-utils';
import SurveySubmittedViewCell, { SurveySubmittedViewCellParams } from './SurveySubmittedViewCell';


describe('SurveySubmittedViewCell', () => {
    const mockParams = (overrides?: Partial<SurveySubmittedViewCellParams>) => {
        return {
            value: null,
            ...overrides,
        } as SurveySubmittedViewCellParams;
    };

    it('renders empty when content is null', () => {
        const params = mockParams();
        const { baseElement } = render(
            <SurveySubmittedViewCell params={ params }/>,
        );
        expect(baseElement.innerHTML).toEqual('<div></div>');
    });

    it('renders relative date of most recent submission', () => {
        const today = new Date();
        const threeDaysAgo = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 3,
            today.getHours() + 1,
        );

        const params = mockParams({
            value: [
                { submission_id: 2, submitted: '1989-07-05' },
                { submission_id: 3, submitted: threeDaysAgo.toUTCString() },
                { submission_id: 1, submitted: '1857-07-05' },
            ],
        });
        const { getByText } = render(
            <SurveySubmittedViewCell params={ params }/>,
        );

        getByText('3 days ago');
    });
});
