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
  });
});
