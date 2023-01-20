import getUniqueColumnName from './getUniqueColumnName';
import { ZetkinViewColumn } from '../components/types';

describe('getUniqueColumnName()', () => {
  it('does nothing when there are no other columns', () => {
    const result = getUniqueColumnName('title', []);
    expect(result).toEqual('title');
  });

  it('does nothing when name is not used by any other column', () => {
    const result = getUniqueColumnName('title', [
      { title: 'First name' } as ZetkinViewColumn,
      { title: 'Last name' } as ZetkinViewColumn,
    ]);

    expect(result).toEqual('title');
  });

  it('suffixes he number 2 when name is taken', () => {
    const result = getUniqueColumnName('title', [
      { title: 'First name' } as ZetkinViewColumn,
      { title: 'Last name' } as ZetkinViewColumn,
      { title: 'title' } as ZetkinViewColumn,
    ]);

    expect(result).toEqual('title 2');
  });

  it('increments number when suffixed name is taken', () => {
    const result = getUniqueColumnName('title', [
      { title: 'First name' } as ZetkinViewColumn,
      { title: 'Last name' } as ZetkinViewColumn,
      { title: 'title' } as ZetkinViewColumn,
      { title: 'title 2' } as ZetkinViewColumn,
    ]);

    expect(result).toEqual('title 3');
  });

  it('increments number > 10 when suffixed name is taken', () => {
    const columns = [{ title: 'title' } as ZetkinViewColumn];

    // Fill up to 99
    for (let i = 2; i < 100; i++) {
      columns.push({ title: `title ${i}` } as ZetkinViewColumn);
    }

    const result = getUniqueColumnName('title', columns);

    expect(result).toEqual('title 100');
  });
});
