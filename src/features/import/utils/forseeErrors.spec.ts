import { CountryCode } from 'libphonenumber-js/types.cjs';

import forseeErrors from './forseeErrors';
import { organization as mockOrganization } from 'utils/testing/mocks/mockOrganization';
import { ColumnKind, Sheet } from './types';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';

const mockSheet: Sheet = {
  columns: [],
  firstRowIsHeaders: true,
  rows: [],
  title: 'Mock Sheet',
};

const countryCode = mockOrganization.country as CountryCode;

const mockCustomFields: ZetkinCustomField[] = [
  {
    description: null,
    id: 1,
    organization: mockOrganization,
    slug: 'extra_url',
    title: 'Website',
    type: CUSTOM_FIELD_TYPE.URL,
  },
  {
    description: null,
    id: 2,
    organization: mockOrganization,
    slug: 'extra_date',
    title: 'Birthday',
    type: CUSTOM_FIELD_TYPE.DATE,
  },
];

describe('forseeErrors()', () => {
  describe('when first row is headers', () => {
    it('identifies if there is insufficient identifying info', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ field: 'phone', kind: ColumnKind.FIELD, selected: true }],
        rows: [
          {
            data: ['PHONE'],
          },
          {
            data: ['040244312'],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['noIdentifier']);
    });

    it('accepts empty external IDs', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        ],
        rows: [
          {
            data: ['Ext id'],
          },
          {
            data: ['123'],
          },
          {
            data: [null],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );

      expect(errors).toHaveLength(0);
    });

    it('identifies if there are missing ids in a Zetkin ID column', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ idField: 'id', kind: ColumnKind.ID_FIELD, selected: true }],
        rows: [
          {
            data: ['ZETKIN ID'],
          },
          {
            data: [''],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['idValueMissing']);
    });

    it('identifies if user has not selected if ID column is Zetkin IDs or external IDs', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [{ idField: null, kind: ColumnKind.ID_FIELD, selected: true }],
        rows: [
          {
            data: ['ZETKIN ID'],
          },
          {
            data: [12],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['notSelectedIdType']);
    });

    it('identifies if ID column has not been selected, but there are first- and last names', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { field: 'first_name', kind: ColumnKind.FIELD, selected: true },
          { field: 'last_name', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['NAME', 'LAST NAME'],
          },
          {
            data: ['Angela', 'Davis'],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
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

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['phone']);
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

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
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

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
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

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
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

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['postCode']);
    });

    it('identifies malformed values in custom URL column', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'extra_url', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'WEBSITE'],
          },
          {
            data: [1, 'www.zetkinfoundation.org'], //string that is a valid url
          },
          {
            data: [2, 'no website'], //string, not an url
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['url']);
    });

    it('identifies malformed values in custom Date column', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'extra_date', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: ['ID', 'BIRTHDAY'],
          },
          {
            data: [1, '19880514'], //string that is a valid date
          },
          {
            data: [2, 'birthday unknown'], //string, but not a date
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['date']);
    });

    it('identifies when values are too long', () => {
      const configuredSheet: Sheet = {
        ...mockSheet,
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          { field: 'first_name', kind: ColumnKind.FIELD, selected: true },
          { field: 'last_name', kind: ColumnKind.FIELD, selected: true },
          { field: 'co_address', kind: ColumnKind.FIELD, selected: true },
          { field: 'street_address', kind: ColumnKind.FIELD, selected: true },
          { field: 'country', kind: ColumnKind.FIELD, selected: true },
        ],
        rows: [
          {
            data: [
              'EXTERNAL ID',
              'FIRST NAME',
              'LAST NAME',
              'CO ADDRESS',
              'STREET ADDRESS',
              'COUNTRY',
            ],
          },
          {
            //These values are all too long
            data: [
              //External id, max 96 characters
              'ask own. Praise effect wishes change way and any wanted. Lively use looked latter regard had. Do he it part more last in. Merits ye if mr na',
              //First name, max 50 characters
              'Asterix Obelix Clara Angela Borrelia Amalia Henny Josephine Alexandra',
              //Last name, max 50 characters
              'Zetkin Johansson Fredriksson Smith Carlsson Hellberg von Ståtsson Pålsson',
              //C/O address, max 200 characters
              'As collected deficient objection by it discovery sincerity curiosity. Quiet decay who round three world whole has mrs man. Built the china there tried jokes which gay why. Assure in adieus wicket it is. But spoke round point and one joy. Offending her moonlight men sweetness see unwilling. Often of it tears whole oh balls share an',
              //Street address, max 200 characters
              'As collected deficient objection by it discovery sincerity curiosity. Quiet decay who round three world whole has mrs man. Built the china there tried jokes which gay why. Assure in adieus wicket it is. But spoke round point and one joy. Offending her moonlight men sweetness see unwilling. Often of it tears whole oh balls share an',
              //Country, max 60 characters
              'As collected deficient objection by it discovery sincerity cloud',
            ],
          },
          {
            //These values are within correct length
            data: [
              '235',
              'Clara',
              'Zetkin',
              'c/o Angela Davis',
              'HauptStrasse 23',
              'Germany',
            ],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual([
        'longExtId',
        'longFirstName',
        'longLastName',
        'longCoAddress',
        'longStreetAddress',
        'longCountry',
      ]);
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
            data: ['id', 'missing phone number', 'Man', 'no email'],
          },
        ],
      };

      const errors = forseeErrors(
        configuredSheet,
        countryCode,
        mockCustomFields
      );
      expect(errors).toEqual(['id', 'phone', 'gender', 'email']);
    });
  });
});
