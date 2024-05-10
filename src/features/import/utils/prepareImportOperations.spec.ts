import { CountryCode } from 'libphonenumber-js/types.cjs';
import { describe, it } from '@jest/globals';

import { organization as mockOrganization } from 'utils/testing/mocks/mockOrganization';
import prepareImportOperations from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';

const countryCode = mockOrganization.country as CountryCode;

describe('prepareImportOperations()', () => {
  describe('when first row is header', () => {
    it('converts Zetkin ID', () => {
      const configData: Sheet = {
        columns: [{ idField: 'id', kind: ColumnKind.ID_FIELD, selected: true }],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            id: 123,
          },
          op: 'person.import',
        },
        {
          data: {
            id: 124,
          },
          op: 'person.import',
        },
      ]);
    });

    it('converts external ID', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            ext_id: '123',
          },
          op: 'person.import',
        },
        {
          data: {
            ext_id: '124',
          },
          op: 'person.import',
        },
      ]);
    });

    it('converts data only', () => {
      const configData: Sheet = {
        columns: [
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
        {
          data: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
      ]);
    });
    it('converts tags only', () => {
      const configData: Sheet = {
        columns: [
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          { kind: ColumnKind.UNKNOWN, selected: false },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          op: 'person.import',
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          op: 'person.import',
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });
    it('converts simple data with ID', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          { kind: ColumnKind.UNKNOWN, selected: false },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
        {
          data: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
        },
      ]);
    });
    it('converts ID, data, tags and orgs', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 272, value: 2 },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });
    it('converts ID, data and tags', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });
    it('converts other columns when ID column is not chosen', () => {
      const configData: Sheet = {
        columns: [
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 272, value: 2 },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'First name', 'Last Name', 'DevTag', 'Org'],
          },
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });
  });

  describe('when first row is not header', () => {
    it('converts ID, data, tags and orgs', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'first_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            field: 'last_name',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 272, value: 2 },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['123', 'Jane', 'Doe', 'Frontend', 1],
          },
          {
            data: ['124', 'John', 'Doe', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            ext_id: '123',
            first_name: 'Jane',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            ext_id: '124',
            first_name: 'John',
            last_name: 'Doe',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });
  });

  describe('prepareImportOperations excludes mapping rows with empty or null values', () => {
    it('excludes empty string and null in data', () => {
      const configData: Sheet = {
        columns: [
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 273, value: 2 },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: true,
        rows: [
          {
            data: ['ID', 'City', 'DevTag', 'Org'],
          },
          {
            data: ['123', null, 'Frontend', 1],
          },
          {
            data: ['124', 'Linköping', 'Backend', 2],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            city: 'Linköping',
          },
          op: 'person.import',
          organizations: [273],
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });

    it('excludes empty string, null or not matched value tags', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [{ orgId: 272, value: 1 }],
            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['123', 'Linköping', null, 1],
          },
          {
            data: ['124', 'Linköping', 'Backend', 1],
          },
          {
            data: ['125', 'Linköping', 'Designer', 1],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            city: 'Linköping',
            ext_id: '123',
          },
          op: 'person.import',
          organizations: [272],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '124',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 124 }, { id: 100 }],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '125',
          },
          op: 'person.import',
          organizations: [272],
        },
      ]);
    });

    it('excludes empty string or null in orgs', () => {
      const configData: Sheet = {
        columns: [
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 273, value: 2 },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['123', 'Linköping', 'Frontend', 1],
          },
          {
            data: ['124', 'Linköping', 'Backend', null],
          },
          {
            data: ['125', 'Linköping', 'Backend', 3],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            city: 'Linköping',
            ext_id: '123',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '124',
          },
          op: 'person.import',
          tags: [{ id: 124 }, { id: 100 }],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '125',
          },
          op: 'person.import',
          tags: [{ id: 124 }, { id: 100 }],
        },
      ]);
    });

    it('excludes all rows that has empty string or null', () => {
      const configData: Sheet = {
        columns: [
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 273, value: 2 },
            ],
            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],
            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['Linköping', '123', 1, ''],
          },
          {
            data: ['', '', 2, 'Backend'],
          },
          {
            data: ['Malmö', '125', null, 'Designer'],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            city: 'Linköping',
            ext_id: '123',
          },
          op: 'person.import',
          organizations: [272],
        },
        {
          op: 'person.import',
          organizations: [273],
          tags: [{ id: 124 }, { id: 100 }],
        },
        {
          data: {
            city: 'Malmö',
            ext_id: '125',
          },
          op: 'person.import',
        },
      ]);
    });

    it('correctly adds up multiple columns of tags', () => {
      const configData: Sheet = {
        columns: [
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 272, value: 1 },
              { orgId: 273, value: 2 },
            ],
            selected: true,
          },
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],

            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 111 }, { id: 222 }], value: 'Cat' },
              { tags: [{ id: 333 }, { id: 444 }], value: 'Dog' },
            ],

            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['Linköping', '123', 1, 3, 'Frontend', 'Cat'],
          },
          {
            data: ['Linköping', '125', 2, 4, 'Backend', 'Dog'],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            city: 'Linköping',
            ext_id: '123',
          },
          op: 'person.import',
          organizations: [272],
          tags: [{ id: 123 }, { id: 100 }, { id: 111 }, { id: 222 }],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '125',
          },
          op: 'person.import',
          organizations: [273],
          tags: [{ id: 124 }, { id: 100 }, { id: 333 }, { id: 444 }],
        },
      ]);
    });

    it('removes leading/trailing spaces from email addresses', () => {
      const configData: Sheet = {
        columns: [
          {
            field: 'email',
            kind: ColumnKind.FIELD,
            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: [' clara@example.com '],
          },
          {
            data: ['zetkin@example.com'],
          },
        ],
        title: '',
      };

      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            email: 'clara@example.com',
          },
          op: 'person.import',
        },
        {
          data: {
            email: 'zetkin@example.com',
          },
          op: 'person.import',
        },
      ]);
    });

    it('remove duplicated tagIds', () => {
      const configData: Sheet = {
        columns: [
          {
            field: 'city',
            kind: ColumnKind.FIELD,
            selected: true,
          },
          { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
          {
            kind: ColumnKind.ORGANIZATION,
            mapping: [
              { orgId: 111, value: 1 },
              { orgId: 333, value: 2 },
            ],
            selected: true,
          },
          { kind: ColumnKind.UNKNOWN, selected: false },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 123 }, { id: 100 }], value: 'Frontend' },
              { tags: [{ id: 124 }, { id: 100 }], value: 'Backend' },
            ],

            selected: true,
          },
          {
            kind: ColumnKind.TAG,
            mapping: [
              { tags: [{ id: 100 }, { id: 222 }], value: 'Cat' },
              { tags: [{ id: 333 }, { id: 444 }], value: 'Dog' },
            ],

            selected: true,
          },
        ],
        firstRowIsHeaders: false,
        rows: [
          {
            data: ['Linköping', '123', 1, 3, 'Frontend', 'Cat'],
          },
          {
            data: ['Linköping', '125', 2, 4, 'Backend', 'Dog'],
          },
        ],
        title: 'My sheet',
      };
      const result = prepareImportOperations(configData, countryCode);
      expect(result).toEqual([
        {
          data: {
            city: 'Linköping',
            ext_id: '123',
          },
          op: 'person.import',
          organizations: [111],
          tags: [{ id: 123 }, { id: 100 }, { id: 222 }],
        },
        {
          data: {
            city: 'Linköping',
            ext_id: '125',
          },
          op: 'person.import',
          organizations: [333],
          tags: [{ id: 124 }, { id: 100 }, { id: 333 }, { id: 444 }],
        },
      ]);
    });
  });
});
