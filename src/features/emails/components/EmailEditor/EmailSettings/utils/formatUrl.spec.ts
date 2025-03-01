import formatUrl from './formatUrl';

describe('formatUrl()', () => {
  it('does nothing if value is a correctly formatted url', () => {
    const formatted = formatUrl('http://www.google.com');
    expect(formatted).toEqual('http://www.google.com');
  });

  it('adds http:// to a correct url without http://', () => {
    const formatted = formatUrl('www.google.com');
    expect(formatted).toEqual('http://www.google.com');
  });

  it('returns null if the input value is not a valid url', () => {
    const formatted = formatUrl('Angela');
    expect(formatted).toEqual(null);
  });

  it('does nothing with a valid mailto: url', () => {
    const formatted = formatUrl('mailto:test@example.org');
    expect(formatted).toEqual('mailto:test@example.org');
  });
});
