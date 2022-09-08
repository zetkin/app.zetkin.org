import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { render } from 'utils/testing';
import SurveySubmittedViewCell from './SurveySubmittedViewCell';

describe('SurveySubmittedViewCell', () => {
  const mockParams = (overrides?: Partial<GridRenderCellParams>) => {
    return {
      field: 'fieldName',
      value: null,
      ...overrides,
    } as GridRenderCellParams;
  };

  it('renders empty when content is null', () => {
    const params = mockParams();
    const { baseElement } = render(
      <SurveySubmittedViewCell params={params as GridRenderCellParams} />
    );
    expect(baseElement.innerHTML).toEqual('<div></div>');
  });

  it('renders relative date of most recent submission', () => {
    const today = new Date();
    const threeDaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 3,
      today.getHours() + 1
    );

    const submissions = [
      { submission_id: 2, submitted: '1989-07-05' },
      { submission_id: 3, submitted: threeDaysAgo.toISOString() },
      { submission_id: 1, submitted: '1857-07-05' },
    ];

    const params = mockParams({
      row: {
        fieldName: submissions,
      },
    });

    const { getByText } = render(
      <SurveySubmittedViewCell params={params as GridRenderCellParams} />
    );

    getByText('3 days ago');
  });
});
