import prepareImportOperations from './prepareImportOperations';
import { ColumnKind, Sheet } from './types';
import { describe, it } from '@jest/globals';

describe('prepareImportOperations when first row is header', () => {
  it('converts ID only', () => {
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
        },
        op: 'person.import',
      },
      {
        fields: {
          ext_id: '124',
        },
        op: 'person.import',
      },
    ]);
  });
  it('converts fields only', () => {
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
      },
      {
        fields: {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        op: 'person.import',
        tags: [123, 100],
      },
      {
        op: 'person.import',
        tags: [124, 100],
      },
    ]);
  });
  it('converts simple fields with ID', () => {
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
      },
      {
        fields: {
          ext_id: '124',
          first_name: 'John',
          last_name: 'Doe',
        },
        op: 'person.import',
      },
    ]);
  });
  it('converts ID, fields, tags and orgs', () => {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [123, 100],
      },
      {
        fields: {
          ext_id: '124',
          first_name: 'John',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [124, 100],
      },
    ]);
  });
  it('converts ID, fields and tags', () => {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
        tags: [123, 100],
      },
      {
        fields: {
          ext_id: '124',
          first_name: 'John',
          last_name: 'Doe',
        },
        op: 'person.import',
        tags: [124, 100],
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [123, 100],
      },
      {
        fields: {
          first_name: 'John',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [124, 100],
      },
    ]);
  });
});

describe('prepareImportOperations when first row is not header', () => {
  it('converts ID, fields, tags and orgs', () => {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
          first_name: 'Jane',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [123, 100],
      },
      {
        fields: {
          ext_id: '124',
          first_name: 'John',
          last_name: 'Doe',
        },
        op: 'person.import',
        organizations: 272,
        tags: [124, 100],
      },
    ]);
  });
});

describe('prepareImportOperations excludes mapping rows with empty or null values', () => {
  it('excludes empty string and null in fields', () => {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
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
          data: ['123', null, 'Frontend', 1],
        },
        {
          data: ['124', 'Linköping', 'Backend', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {},
        op: 'person.import',
        organizations: 272,
        tags: [123, 100],
      },
      {
        fields: {
          city: 'Linköping',
        },
        op: 'person.import',
        organizations: 272,
        tags: [124, 100],
      },
    ]);
  });

  it('excludes empty string and null in tags', () => {
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
            { tagIds: [123, 100], value: 'Frontend' },
            { tagIds: [124, 100], value: 'Backend' },
          ],
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgId: 272, value: 1 },
            { orgId: 272, value: 2 },
            { orgId: 272, value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', null, null, 1],
        },
        {
          data: ['124', 'Linköping', 'Backend', 2],
        },
        {
          data: ['125', '', 'yeah', 2],
        },
      ],
      title: 'My sheet',
    };
    const result = prepareImportOperations(configData);
    expect(result).toEqual([
      {
        fields: {
          ext_id: '123',
        },
        op: 'person.import',
        organizations: 272,
      },
      {
        fields: {
          city: 'Linköping',
          ext_id: '124',
        },
        op: 'person.import',
        organizations: 272,
        tags: [124, 100],
      },
      {
        fields: {
          ext_id: '125',
        },
        op: 'person.import',
        organizations: 272,
      },
    ]);
  });
});
