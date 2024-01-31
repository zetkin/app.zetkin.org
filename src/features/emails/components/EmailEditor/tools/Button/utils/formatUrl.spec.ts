import formatUrl from './formatUrl';

describe('formatUrl()', () => {
  it('does nothing if value is a correctly formatted url', () => {
    const url = formatUrl('http://www.google.com');
    expect(url).toEqual('http://www.google.com');
  });

  it('adds http:// to a correct url without http://', () => {
    const url = formatUrl('www.google.com');
    expect(url).toEqual('http://www.google.com');
  });

  it('returns empty string if the input value is not a valid url', () => {
    const url = formatUrl('Angela');
    expect(url).toEqual('');
  });
});
