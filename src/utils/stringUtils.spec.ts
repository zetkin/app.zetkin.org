import { stringToBool } from './stringUtils';

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
