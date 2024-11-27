import dateParsingIsValid from './dateParsingIsValid';

describe('dateParsingIsValid()', () => {
  it.each([
    ['650325-4571', true],
    ['19561129-3049', true],
    ['196503254571', true],
    ['6503254571', true],
    ['040325-4571', true],
    ['20040325-4571', true],
  ])(
    'validates the parsing of swedish personnummer %p to %p',
    (input, output) => {
      const isValid = dateParsingIsValid(input, 'se');

      expect(isValid).toEqual(output);
    }
  );

  it.each([
    ['25036545715', true],
    ['250304-45715', true],
    ['25030445715', true],
  ])(
    'validates the parsing of norwegian fødselsnummer %p to %p',
    (input, output) => {
      const isValid = dateParsingIsValid(input, 'no');

      expect(isValid).toEqual(output);
    }
  );

  it.each([
    ['250365-4571', true],
    ['2503654571', true],
    ['250304-4571', true],
    ['2503044571', true],
  ])('validates parsing of danish CPR-nummer %p to %p', (input, output) => {
    const isValid = dateParsingIsValid(input, 'dk');

    expect(isValid).toEqual(output);
  });

  it.each([
    [{ format: 'YYYY-MM-DD', value: '1965-03-25' }, true],
    [{ format: 'YY/MM/DD', value: '65/03/25' }, true],
    [{ format: 'DD.MM.YY', value: '04.04.04' }, true],
    [{ format: 'DD MM YYYY', value: '04 04 2004' }, true],
  ])('validates custom format %p to %p', (input, output) => {
    const isValid = dateParsingIsValid(input.value, input.format);

    expect(isValid).toEqual(output);
  });

  it.each([
    [{ format: 'YYYY-MM-DD', value: '250304-45715' }, false],
    [{ format: 'YY/MM/DD', value: '04.04.04' }, false],
    [{ format: 'DD.MM.YY', value: '6503254571' }, false],
    [{ format: 'DD MM YYYY', value: '65/03/25' }, false],
  ])('validates wrong format %p to %p', (input, output) => {
    const isValid = dateParsingIsValid(input.value, input.format);

    expect(isValid).toEqual(output);
  });
});
