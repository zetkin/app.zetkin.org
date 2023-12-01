import { CountryCode } from 'libphonenumber-js/types.cjs';

import forseeErrors from './forseeErrors';
import { organization as mockOrganization } from 'utils/testing/mocks/mockOrganization';
import { ColumnKind, Sheet } from './types';

const mockSheet: Sheet = {
  columns: [],
  firstRowIsHeaders: true,
  rows: [],
  title: 'Mock Sheet',
};

const countryCode = mockOrganization.country as CountryCode;

describe('forseeErrors()', () => {
  describe('when first row is headers', () => {
    it('identifies an error in parsing malformed phone numbers', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ field: 'phone', kind: ColumnKind.FIELD, selected: true }],
        rows: [
          {
            data: ['PHONE'],
          },
          {
            data: ['0739567148'],
          },
          {
            data: ['missing'], //not a number
          },
          {
            data: ['6'], //too short
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['phone', 'phone']);
    });

    it('identifies malformed genders', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ field: 'gender', kind: ColumnKind.FIELD, selected: true }],
        rows: [
          {
            data: ['GENDER'],
          },
          {
            data: ['o'], //Correct - API can take 'o', 'f', 'm' and null
          },
          {
            data: ['female'], //string, but wrong content
          },
          {
            data: ['M'], // we parse this to lowercase, so it's ok
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['gender']);
    });

    it('identifies malformed emails', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ field: 'email', kind: ColumnKind.FIELD, selected: true }],
        rows: [
          {
            data: ['EMAIL'],
          },
          {
            data: ['angela@gmail.com'],
          },
          {
            data: ['no email'],
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['email']);
    });
  });

  describe('when first row is not headers', () => {
    it('correctly finds all types of errors', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { field: 'phone', kind: ColumnKind.FIELD, selected: true },
          { field: 'gender', kind: ColumnKind.FIELD, selected: true },
          { field: 'email', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['076291837', 'f', 'angela@gmail.com'],
          },
          {
            data: ['missing phone number', 'Man', 'no email'],
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['phone', 'gender', 'email']);
    });
  });
});
