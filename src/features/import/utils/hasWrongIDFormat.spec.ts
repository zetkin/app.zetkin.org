import { ColumnKind } from './types';
import hasWrongIDFormat from './hasWrongIDFormat';

describe('hasWrongIDFormat()', () => {
  it('returns false for external ID columns', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'ext_id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      [],
      true
    );

    expect(wrongIDFormat).toBe(false);
  });

  it('returns false for empty Zetkin IDs', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'id',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Zetkin IDs', 1, 2, null, '', 4],
      true
    );
    expect(wrongIDFormat).toBe(false);
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

  it('returns false if all email values are correctly formatted', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'email',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Email', 'user@example.com', 'test@test.org'],
      true
    );

    expect(wrongIDFormat).toBe(false);
  });

  it('returns true if any email value is not a correct email', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'email',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Email', 'not-an-email', 'valid@example.com'],
      true
    );

    expect(wrongIDFormat).toBe(true);
  });

  it('returns false if email value is empty', () => {
    const wrongIDFormat = hasWrongIDFormat(
      {
        idField: 'email',
        kind: ColumnKind.ID_FIELD,
        selected: true,
      },
      ['Email', '', 'another@example.com'],
      true
    );

    expect(wrongIDFormat).toBe(false);
  });
});
