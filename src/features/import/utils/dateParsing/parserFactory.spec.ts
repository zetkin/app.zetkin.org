import parserFactory from './parserFactory';

describe('parserFactory()', () => {
  describe('parse()', () => {
    it('Returns empty string when passed an empty string', () => {
      const danishParser = parserFactory('dk');
      const parsedEmptyString = danishParser.parse('');

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
      const parser = parserFactory('se');
      const parsedDate = parser.parse(input);

      expect(parsedDate).toEqual(output);
    });

    it.each([
      ['250365-4571', '1965-03-25'],
      ['2503654571', '1965-03-25'],
      ['250304-4571', '2004-03-25'],
      ['2503044571', '2004-03-25'],
    ])('parses danish CPR-nummer %p to %p', (input, output) => {
      const parser = parserFactory('dk');
      const parsedDate = parser.parse(input);

      expect(parsedDate).toEqual(output);
    });

    it.each([
      ['25036545715', '1965-03-25'],
      ['250304-45715', '2004-03-25'],
      ['25030445715', '2004-03-25'],
    ])('parses norwegian fødselsnummer %p to %p', (input, output) => {
      const parser = parserFactory('no');
      const parsedDate = parser.parse(input);

      expect(parsedDate).toEqual(output);
    });

    it.each([
      [{ format: 'YYYY-MM-DD', value: '1965-03-25' }, '1965-03-25'],
      [{ format: 'YY/MM/DD', value: '65/03/25' }, '1965-03-25'],
      [{ format: 'DD.MM.YY', value: '04.04.04' }, '2004-04-04'],
      [{ format: 'DD MM YYYY', value: '04 04 2004' }, '2004-04-04'],
    ])('parses custom format %p to %p', (input, output) => {
      const parser = parserFactory(input.format);
      const parsedDate = parser.parse(input.value);

      expect(parsedDate).toEqual(output);
    });

    it('returns empty string if a value cannot be parsed in the given format', () => {
      const parser = parserFactory('MM-DD-YYYY');
      const parsedDate = parser.parse('19650325');

      expect(parsedDate).toBe('');
    });

    it('correctly parses a 2-digit year into the right century', () => {
      const parser = parserFactory('YYMMDD');
      const firstDate = parser.parse('290101');
      const secondDate = parser.parse('120101');

      expect(firstDate).toBe('1929-01-01');
      expect(secondDate).toBe('2012-01-01');
    });

    it('does not attempt to change the century of a date with 4-digit year', () => {
      const twoDigitYearParser = parserFactory('YYMMDD');
      const fourDIgitYearParser = parserFactory('YYYYMMDD');
      const firstDate = twoDigitYearParser.parse('230101');
      const secondDate = fourDIgitYearParser.parse('20230101');

      expect(firstDate).toBe('2023-01-01');
      expect(secondDate).toBe('2023-01-01');
    });
  });

  describe('validate()', () => {
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
        const parser = parserFactory('se');
        const isValid = parser.validate(input);

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
        const parser = parserFactory('no');
        const isValid = parser.validate(input);

        expect(isValid).toEqual(output);
      }
    );

    it.each([
      ['250365-4571', true],
      ['2503654571', true],
      ['250304-4571', true],
      ['2503044571', true],
    ])('validates parsing of danish CPR-nummer %p to %p', (input, output) => {
      const parser = parserFactory('dk');
      const isValid = parser.validate(input);

      expect(isValid).toEqual(output);
    });

    it.each([
      [{ format: 'YYYY-MM-DD', value: '1965-03-25' }, true],
      [{ format: 'YY/MM/DD', value: '65/03/25' }, true],
      [{ format: 'DD.MM.YY', value: '04.04.04' }, true],
      [{ format: 'DD MM YYYY', value: '04 04 2004' }, true],
    ])('validates custom format %p to %p', (input, output) => {
      const parser = parserFactory(input.format);
      const isValid = parser.validate(input.value);

      expect(isValid).toEqual(output);
    });

    it.each([
      [{ format: 'YYYY-MM-DD', value: '250304-45715' }, false],
      [{ format: 'YY/MM/DD', value: '04.04.04' }, false],
      [{ format: 'DD.MM.YY', value: '6503254571' }, false],
      [{ format: 'DD MM YYYY', value: '65/03/25' }, false],
    ])('validates wrong format %p to %p', (input, output) => {
      const parser = parserFactory(input.format);
      const isValid = parser.validate(input.value);

      expect(isValid).toEqual(output);
    });
  });
});
