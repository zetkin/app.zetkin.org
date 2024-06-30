import { describe, it } from '@jest/globals';

import createPreviewData from './createPreviewData';
import { ColumnKind, Sheet } from './types';

describe('createPreviewData()', () => {
  it('converts fields to preview object', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'ext_id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'city',
          kind: ColumnKind.FIELD,
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Linköping'],
        },
        {
          data: ['124', 'Linköping'],
        },
        {
          data: ['125', 'Linköping'],
        },
      ],
      title: 'My sheet',
    };
    const result = createPreviewData(configData, 1);
    expect(result).toEqual({
      data: {
        city: 'Linköping',
        ext_id: '124',
      },
    });
  });
  it('converts tags to preview object', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
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
      ],
      firstRowIsHeaders: true,
      rows: [
        {
          data: ['ID', 'City', 'Development'],
        },
        {
          data: ['123', 'Malmö', 'Frontend'],
        },
        {
          data: ['124', 'Linköping', 'Backend'],
        },
        {
          data: ['125', 'Linköping', 'Designer'],
        },
      ],
      title: 'My sheet',
    };
    const result = createPreviewData(configData, 1);
    expect(result).toEqual({
      data: {
        city: 'Malmö',
        id: '123',
      },
      tags: [{ id: 123 }, { id: 100 }],
    });
  });

  it('converts orgs to preview object', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'city',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgId: 111, value: 1 },
            { orgId: 333, value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Malmö', 1],
        },
        {
          data: ['124', 'Linköping', 2],
        },
        {
          data: ['125', 'Linköping', 1],
        },
      ],
      title: 'My sheet',
    };
    const result = createPreviewData(configData, 0);
    expect(result).toEqual({
      data: {
        city: 'Malmö',
        id: '123',
      },
      organizations: [111],
    });
  });

  it('returns empty obejct when there are no values', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'city',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          kind: ColumnKind.ORGANIZATION,
          mapping: [
            { orgId: 111, value: 1 },
            { orgId: 333, value: 2 },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: [null, '', null],
        },
        {
          data: ['124', 'Linköping', 2],
        },
        {
          data: ['125', 'Linköping', 1],
        },
      ],
      title: 'My sheet',
    };
    const result = createPreviewData(configData, 0);
    expect(result).toEqual({});
  });

  it('returns tags for empty value', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
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
            { tags: [{ id: 222 }, { id: 100 }], value: null },
          ],
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Malmö', null],
        },
        {
          data: ['124', 'Linköping', 'Frontend'],
        },
        {
          data: ['125', 'Linköping', ''],
        },
      ],
      title: 'My sheet',
    };
    const result = createPreviewData(configData, 0);
    expect(result).toEqual({
      data: {
        city: 'Malmö',
        id: '123',
      },
      tags: [{ id: 222 }, { id: 100 }],
    });
  });

  it('converts dates into preview object', () => {
    const configData: Sheet = {
      columns: [
        { idField: 'id', kind: ColumnKind.ID_FIELD, selected: true },
        {
          field: 'city',
          kind: ColumnKind.FIELD,
          selected: true,
        },
        {
          dateFormat: 'se',
          field: 'birthday',
          kind: ColumnKind.DATE,
          selected: true,
        },
      ],
      firstRowIsHeaders: false,
      rows: [
        {
          data: ['123', 'Malmö', '890215-3459'],
        },
        {
          data: ['124', 'Linköping', '021208-5643'],
        },
        {
          data: ['125', 'Linköping', '650325-2391'],
        },
      ],
      title: 'My sheet',
    };

    const result = createPreviewData(configData, 0);
    expect(result).toEqual({
      data: {
        birthday: '1989-02-15',
        city: 'Malmö',
        id: '123',
      },
    });
  });
});
