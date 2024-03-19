import convertDateTimeToLocal from './convertDateTimeToLocal';

describe('convertDateTimeToLocal()', () => {
  it('adds UTC timezone to a naive datetime string', () => {
    const local = convertDateTimeToLocal('2024-01-01T13:00');

    expect(local).toEqual('2024-01-01T13:00Z');
  });

  it('does nothing to a datetime string that is in UTC time', () => {
    const local = convertDateTimeToLocal('2024-01-01T13:00Z');

    expect(local).toEqual('2024-01-01T13:00Z');
  });

  it('removes the Z if the datetime string has both a timezone and a Z', () => {
    const local = convertDateTimeToLocal('2024-01-01T13:00-03:00Z');

    expect(local).toEqual('2024-01-01T13:00-03:00');
  });

  it('does nothing to a datetime string that ends with a timezone', () => {
    const local = convertDateTimeToLocal('2024-01-01T13:00-03:00');

    expect(local).toEqual('2024-01-01T13:00-03:00');
  });
});
