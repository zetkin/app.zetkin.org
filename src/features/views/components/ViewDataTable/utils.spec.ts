import { COLUMN_TYPE } from 'features/views/components/types';
import mockPersonNote from 'utils/testing/mocks/mockPersonNote';
import mockViewCol from 'utils/testing/mocks/mockViewCol';
import mockViewRow from 'utils/testing/mocks/mockViewRow';
import { PersonNote } from './cells/PersonNotesViewCell';
import { viewQuickSearch } from './utils';

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
      type: COLUMN_TYPE.PERSON_NOTES,
    }),
  ];

  const rows = [
    mockViewRow({
      content: ['Angela', 'Davis', [mockPersonNote({ text: 'Note text A' })]],
    }),
    mockViewRow({
      content: ['Clara', 'Zetkin', [mockPersonNote({ text: 'Note text B' })]],
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
    const matchedNotes = matchedRows[0].content[2] as PersonNote[];

    expect(matchedRows.length).toEqual(1);
    expect(matchedNotes).toHaveLength(1);
    expect(matchedNotes[0].text).toEqual('Note text A');
  });
  it('Returns an empty array if no rows match the search', () => {
    const matchedRows = viewQuickSearch(rows, columns, 'text c');

    expect(matchedRows).toEqual([]);
  });
});
