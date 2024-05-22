import parseDate from './parseDate';

describe('parseDate()', () => {
  it('returns an empty string when passed a falsy value', () => {
    const parsedNull = parseDate(null, 'se');
    const parsedEmptyString = parseDate('', 'dk');

    expect(parsedNull).toBe('');
    expect(parsedEmptyString).toBe('');
  });

  it.each([
    ['650325-4571', '1965-03-25'],
    ['19650325-4571', '1965-03-25'],
    ['196503254571', '1965-03-25'],
    ['6503254571', '1965-03-25'],
    ['040325-4571', '2004-03-25'],
    ['20040325-4571', '2004-03-25'],
  ])('parses swedish personnummer %p to %p', (input, output) => {
    const parsedDate = parseDate(input, 'se');

    expect(parsedDate).toEqual(output);
  });

  it.each([
    ['250365-4571', '1965-03-25'],
    ['2503654571', '1965-03-25'],
    ['250304-4571', '2004-03-25'],
    ['2503044571', '2004-03-25'],
  ])('parses danish CPR-nummer %p to %p', (input, output) => {
    const parsedDate = parseDate(input, 'dk');

    expect(parsedDate).toEqual(output);
  });

  it.each([
    ['25036545715', '1965-03-25'],
    ['250304-45715', '2004-03-25'],
    ['25030445715', '2004-03-25'],
  ])('parses norwegian fødselsnummer %p to %p', (input, output) => {
    const parsedDate = parseDate(input, 'no');

    expect(parsedDate).toEqual(output);
  });

  it.each([
    [{ format: 'YYYY-MM-DD', value: '1965-03-25' }, '1965-03-25'],
    [{ format: 'YY/MM/DD', value: '65/03/25' }, '1965-03-25'],
    [{ format: 'DD.MM.YY', value: '04.04.04' }, '2004-04-04'],
    [{ format: 'DD MM YYYY', value: '04 04 2004' }, '2004-04-04'],
  ])('parses custom format %p to %p', (input, output) => {
    const parsedDate = parseDate(input.value, input.format);

    expect(parsedDate).toEqual(output);
  });

  it('parses dates that are passed in number format', () => {
    const parsedDate = parseDate(19650325, 'YYYYMMDD');

    expect(parsedDate).toBe('1965-03-25');
  });

  it('returns empty string if a value cannot be parsed in the given format', () => {
    const parsedDate = parseDate(19650325, 'MM-DD-YYYY');

    expect(parsedDate).toBe('');
  });
});
