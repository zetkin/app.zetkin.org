import { ColumnKind } from './types';
import hasWrongIDFormat from './hasWrongIDFormat';

describe('hasWrongIDFormat()', () => {
  it('returns false if column is ID_FIELD, but not of type "id"', () => {
    const wrongIDFormat1 = hasWrongIDFormat(
      {
        idField: 'ext_id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      [],
      true
    );

    const wrongIDFormat2 = hasWrongIDFormat(
      {
        idField: null,
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      [],
      true
    );

    expect(wrongIDFormat1).toBe(false);
    expect(wrongIDFormat2).toBe(false);
  });

  it('returns false if columnValues are digits and first row is header', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Member IDs', 1, 2, 3, 4],
      true
    );

    expect(wrongIDFormat).toBe(false);
  });

  it('returns false if columnValues are digits and first row is not header', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      [1, 2, 3, 4],
      false
    );

    expect(wrongIDFormat).toBe(false);
  });

  it('returns true if columnValues are not all digits and first row is header', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Member IDs', 'one', 'two', 'three'],
      true
    );

    expect(wrongIDFormat).toBe(true);
  });

  it('returns true if columnValues are not all digits and first row is not header', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['one', null, 'three'],
      false
    );

    expect(wrongIDFormat).toBe(true);
  });
});
