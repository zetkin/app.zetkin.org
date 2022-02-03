import { COLUMN_TYPE } from 'types/views';
import { makeGridColDef } from './utils';
import mockViewCol from 'utils/testing/mocks/mockViewCol';

describe('makeGridColDef', () => {
  it('returns common fields correctly', () => {
    const colMock = mockViewCol();
    const colDef = makeGridColDef(colMock, 1);
    expect(colDef.field).toBe(`col_${colMock.id}`);
    expect(colDef.headerName).toBe(colMock.title);
    expect(colDef.resizable).toBeTruthy();
    expect(colDef.sortable).toBeTruthy();
  });

  it('returns basic default (text) for person_field columns', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        config: { field: 'first_name' },
        type: COLUMN_TYPE.PERSON_FIELD,
      }),
      1
    );

    expect(colDef.minWidth).toBeGreaterThan(50);
    expect(colDef.width).toEqual(150);
  });

  it('returns narrow bool for local_bool columns', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        type: COLUMN_TYPE.LOCAL_BOOL,
      }),
      1
    );
    expect(colDef.type).toEqual('boolean');
    expect(colDef.minWidth).toEqual(50);
  });

  it('returns narrow bool for person_tag columns', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        config: {
          tag_id: 1,
        },
        type: COLUMN_TYPE.PERSON_TAG,
      }),
      1
    );
    expect(colDef.type).toEqual('boolean');
    expect(colDef.minWidth).toEqual(50);
  });

  it('returns narrow bool for person_query columns', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        config: {
          query_id: 1,
        },
        type: COLUMN_TYPE.PERSON_QUERY,
      }),
      1
    );
    expect(colDef.type).toEqual('boolean');
    expect(colDef.minWidth).toEqual(50);
  });

  it('returns wide, custom cell for person_notes', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        type: COLUMN_TYPE.PERSON_NOTES,
      }),
      1
    );
    expect(colDef.width).toEqual(300);
    expect(colDef.renderCell).toBeTruthy();
  });

  it('returns wide, custom cell for survey_response', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        type: COLUMN_TYPE.SURVEY_RESPONSE,
      }),
      1
    );
    expect(colDef.width).toEqual(300);
    expect(colDef.renderCell).toBeTruthy();
  });

  it('returns custom cell for survey_submitted', () => {
    const colDef = makeGridColDef(
      mockViewCol({
        type: COLUMN_TYPE.SURVEY_SUBMITTED,
      }),
      1
    );
    expect(colDef.renderCell).toBeTruthy();
  });
});
