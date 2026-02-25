import { COLUMN_TYPE } from 'features/views/components/types';
import mockViewCol from 'utils/testing/mocks/mockViewCol';
import mockViewRow from 'utils/testing/mocks/mockViewRow';
import { SurveyResponseViewCell } from './columnTypes/SurveyResponseColumnType';
import { viewQuickSearch } from './utils';

let nextSubmissionId = 1;

function mockSurveyResponseCell(text: string): SurveyResponseViewCell {
  return [
    {
      submission_id: nextSubmissionId++,
      submitted: new Date().toISOString(),
      text,
    },
  ];
}

describe('viewQuickSearch', () => {
  const columns = [
    mockViewCol({
      id: 1,
      config: { field: 'first_name' },
      type: COLUMN_TYPE.PERSON_FIELD,
    }),
    mockViewCol({
      id: 2,
      config: { field: 'last_name' },
      type: COLUMN_TYPE.PERSON_FIELD,
    }),
    mockViewCol({
      id: 3,
      type: COLUMN_TYPE.SURVEY_RESPONSE,
    }),
  ];

  const rows = [
    mockViewRow({
      id: 1,
      cells: {
        '1': 'Angela',
        '2': 'Davis',
        '3': mockSurveyResponseCell('Response text AA'),
      },
    }),
    mockViewRow({
      id: 2,
      cells: {
        '1': 'Clara',
        '2': 'Zetkin',
        '3': mockSurveyResponseCell('Response text B'),
      },
    }),
  ];

  it('Correctly returns rows when searching for a string field', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'Zetki');

    expect(matchedRows.length).toEqual(1);
    expect(matchedRows[0].cells['1']).toEqual('Clara');
  });
  it('Searches case-insensitively', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'zetkin');

    expect(matchedRows.length).toEqual(1);
  });
  it('Correctly returns rows when searching for an object field', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'text aa');
    const matchedNotes = matchedRows[0].cells['3'] as SurveyResponseViewCell;

    expect(matchedRows.length).toEqual(1);
    expect(matchedNotes).toHaveLength(1);
    expect(matchedNotes[0].text).toEqual('Response text AA');
  });
  it('Returns an empty array if no rows match the search', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'text ca');

    expect(matchedRows).toEqual([]);
  });
});
