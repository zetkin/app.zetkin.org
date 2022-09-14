import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { render } from 'utils/testing';
import SurveyResponseViewCell from './SurveyResponseViewCell';
import userEvent from '@testing-library/user-event';

const surveyResponses = [
  { submission_id: 1, text: 'This is the response' },
  { submission_id: 2, text: 'This is another response' },
];

describe('SurveyResponseViewCell', () => {
  const mockParams = (overrides?: Partial<GridRenderCellParams>) => {
    return {
      field: 'fieldName',
      value: null,
      ...overrides,
    } as GridRenderCellParams;
  };

  it('renders empty when content is null', () => {
    const params = mockParams();
    const { baseElement } = render(<SurveyResponseViewCell params={params} />);
    expect(baseElement.innerHTML).toEqual('<div></div>');
  });

  it('renders response when at least one exists', () => {
    const params = mockParams({
      row: {
        fieldName: surveyResponses.slice(0, 1),
      },
    });
    const { getByText } = render(<SurveyResponseViewCell params={params} />);
    getByText('This is the response');
  });

  it('renders pop-over with responses', async () => {
    const params = mockParams({
      row: {
        fieldName: surveyResponses,
      },
    });
    const { getByText } = render(<SurveyResponseViewCell params={params} />);
    await userEvent.click(getByText('This is the response'));
    getByText('This is another response');
  });
});
