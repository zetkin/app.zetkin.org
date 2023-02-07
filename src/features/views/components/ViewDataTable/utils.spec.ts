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
      config: {
        field: 'first_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    }),
    mockViewCol({
      config: {
        field: 'last_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    }),
    mockViewCol({
      type: COLUMN_TYPE.SURVEY_RESPONSE,
    }),
  ];

  const rows = [
    mockViewRow({
      content: ['Angela', 'Davis', mockSurveyResponseCell('Response text A')],
    }),
    mockViewRow({
      content: ['Clara', 'Zetkin', mockSurveyResponseCell('Response text B')],
    }),
  ];

  it('Correctly returns rows when searching for a string field', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'Zetki');

    expect(matchedRows.length).toEqual(1);
    expect(matchedRows[0].content[0]).toEqual('Clara');
  });
  it('Searches case-insensitively', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'zetkin');

    expect(matchedRows.length).toEqual(1);
  });
  it('Correctly returns rows when searching for an object field', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'text a');
    const matchedNotes = matchedRows[0].content[2] as SurveyResponseViewCell;

    expect(matchedRows.length).toEqual(1);
    expect(matchedNotes).toHaveLength(1);
    expect(matchedNotes[0].text).toEqual('Response text A');
  });
  it('Returns an empty array if no rows match the search', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'text c');

    expect(matchedRows).toEqual([]);
  });
});
