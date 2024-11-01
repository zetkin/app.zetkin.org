import { ColumnKind } from './types';
import hasUnfinishedMapping from './hasUnfinishedMapping';

describe('hasUnfinishedMapping()', () => {
  it('returns false if columnKind is FIELD', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      field: 'field:email',
      kind: ColumnKind.FIELD,
      selected: true,
    });

    expect(unfinishedMapping).toBe(false);
  });

  it('returns true if column is selected & columnKind is UNKNOWN', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      kind: ColumnKind.UNKNOWN,
      selected: true,
    });

    expect(unfinishedMapping).toBe(true);
  });

  it('returns true if columnKind is ID_FIELD and idField is null', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      idField: null,
      kind: ColumnKind.ID_FIELD,
      selected: true,
    });

    expect(unfinishedMapping).toBe(true);
  });

  it('returns true if columnKind is TAG and mapping length is 0', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      kind: ColumnKind.TAG,
      mapping: [],
      selected: true,
    });

    expect(unfinishedMapping).toBe(true);
  });

  it('returns true if columnKind is ORGANIZATION and mapping length is 0', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      kind: ColumnKind.ORGANIZATION,
      mapping: [],
      selected: true,
    });

    expect(unfinishedMapping).toBe(true);
  });

  it('returns true if columnKind is ENUM and mapping length is 0', () => {
    const unfinishedMapping = hasUnfinishedMapping({
      field: 'enum:dummyField',
      kind: ColumnKind.ENUM,
      mapping: [],
      selected: true,
    });

    expect(unfinishedMapping).toBe(true);
  });
});
