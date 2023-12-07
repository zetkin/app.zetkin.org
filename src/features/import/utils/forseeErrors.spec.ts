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
    it('identifies if ID column has not been selected', () => {
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
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['idMissing']);
    });

    it('identifies an error in parsing malformed phone numbers', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'phone', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'PHONE'],
          },
          {
            data: [1, '0739567148'],
          },
          {
            data: [2, 'missing'], //not a number
          },
          {
            data: [3, '6'], //too short
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['phone', 'phone']);
    });

    it('identifies malformed genders', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'gender', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'GENDER'],
          },
          {
            data: [1, 'o'], //Correct - API can take 'o', 'f', 'm' and null
          },
          {
            data: [2, 'female'], //string, but wrong content
          },
          {
            data: [3, 'M'], // we parse this to lowercase, so it's ok
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['gender']);
    });

    it('identifies malformed emails', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'email', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'EMAIL'],
          },
          {
            data: [1, 'angela@gmail.com'],
          },
          {
            data: [2, 'no email'],
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['email']);
    });

    it('identifies malformed alt phone numbers', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'alt_phone', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'ALT PHONE'],
          },
          {
            data: [1, '0745612930'],
          },
          {
            data: [2, 'no alt phone'],
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['altPhone']);
    });

    it('identifies malformed post codes', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'zip_code', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'POST CODE'],
          },
          {
            data: [1, '34519'], //string, max 10 characters long
          },
          {
            data: [2, 'no post code'], //string, but more than 10 characters
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['postCode']);
    });
  });

  describe('when first row is not headers', () => {
    it('correctly finds all types of errors', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'phone', kind: ColumnKind.FIELD, selected: true },
          { field: 'gender', kind: ColumnKind.FIELD, selected: true },
          { field: 'email', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: [1, '076291837', 'f', 'angela@gmail.com'],
          },
          {
            data: ['2', 'missing phone number', 'Man', 'no email'],
          },
        ],
      };

      const errors = forseeErrors(configuredSheet, countryCode);
      expect(errors).toEqual(['id', 'phone', 'gender', 'email']);
    });
  });
});
