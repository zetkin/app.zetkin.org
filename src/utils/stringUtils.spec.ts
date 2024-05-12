import {
  buildUrl,
  isInteger,
  stringToBool,
  truncateOnMiddle,
} from './stringUtils';

describe('stringToBool()', () => {
  // Returns false
  it('Returns false if passed undefined value ', () => {
    const value = undefined;
    expect(stringToBool(value)).toEqual(false);
  });
  it('Returns false if passed empty string', () => {
    expect(stringToBool('')).toEqual(false);
  });
  it('Returns false if passed string "0"', () => {
    expect(stringToBool('0')).toEqual(false);
  });
  it('Returns false if passed a string other than the word "true"', () => {
    expect(stringToBool('false')).toEqual(false);
    expect(stringToBool('Cosmo Kramer')).toEqual(false);
  });

  // Return true
  it('Returns true if passed a non-zero number as string', () => {
    expect(stringToBool('1')).toEqual(true);
    expect(stringToBool('999')).toEqual(true);
    expect(stringToBool('-1')).toEqual(true);
  });
  it('Returns true if passed the word "true" with any capitalisation', () => {
    expect(stringToBool('true')).toEqual(true);
    expect(stringToBool('TRUE')).toEqual(true);
    expect(stringToBool('TrUe')).toEqual(true);
  });
});

describe('truncateOnMiddle()', () => {
  it('Truncates a string on whitespaces if possible', () => {
    expect(
      truncateOnMiddle(
        'Do you have fascinating facts about feminist political beliefs?',
        40
      )
    ).toEqual('Do you have...beliefs?');
  });
  it("Doesn't truncate if the string is below the length", () => {
    expect(
      truncateOnMiddle(
        'Do you have fascinating facts about feminist political beliefs?',
        500
      )
    ).toEqual(
      'Do you have fascinating facts about feminist political beliefs?'
    );
  });
  it('Falls back to old behaviour if no whitespaces are found', () => {
    expect(truncateOnMiddle('Supercalifragilisticexpialidocious', 20)).toEqual(
      'Supercal...idocious'
    );
  });
});

describe('isInteger()', () => {
  it.each(['0', '2', '20000', '  0', '1  '])(
    'should return true for integer string %p',
    (numberString) => {
      expect(isInteger(numberString)).toBe(true);
    }
  );
  it.each([
    '',
    '    ',
    '3.14',
    'other',

    // TypeScript should catch these, but test that we do not throw in case TS does not
    null as unknown as string,
    undefined as unknown as string,
  ])('should return false for non-integer string %p', (numberString) => {
    expect(isInteger(numberString)).toBe(false);
  });
});

describe('buildUrl()', () => {
  it('combines a hostname and path into a URL', () => {
    expect(buildUrl('https://example.com', '/path/to/resource')).toEqual(
      'https://example.com/path/to/resource'
    );
  });

  it('strips trailing slashes from the hostname', () => {
    expect(buildUrl('https://example.com/', '/path/to/resource')).toEqual(
      'https://example.com/path/to/resource'
    );
  });
});
