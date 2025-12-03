import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import { BulkOp, ImportPreview, PersonImport } from 'features/import/types';
import mockCsv from '../../../mockFiles/mockCsv';

test.describe(
  'When importing with external id, first name and last name from a file where names are missing',
  () => {
    test.beforeEach(({ login }) => {
      login();
    });

    test.afterEach(({ moxy }) => {
      moxy.teardown();
    });

    test('there are no problems and a request is made to /preview', async ({
      appUri,
      moxy,
      page,
    }) => {
      moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);
      await page.goto(appUri + '/organize/1/people');
      await page.locator('data-testid=ZUIButtonMenu-button').click();
      await page.locator('data-testid=import-people').click();
      const data = mockCsv([
        ['id', 'first', 'last', 'email'],
        ['1', '', 'Zetkin', 'clara@example.com'],
        ['2', 'Rosa', '', 'rosa@example.com'],
      ]);

      const dataTransfer = await page.evaluateHandle((data) => {
        const dt = new DataTransfer();
        const file = new File([data], 'data.csv', {
          type: 'text/csv',
        });
        dt.items.add(file);
        return dt;
      }, data);

      await page.dispatchEvent('input', 'drop', {
        dataTransfer,
      });

      await page
        .locator(
          'data-testid=MappingRow-container >> input[type=checkbox] >> nth=0'
        )
        .check();
      await page
        .locator(
          'data-testid=MappingRow-container >> div[role=combobox] >> nth=0'
        )
        .click();
      await page.locator('data-testid=FieldSelect-menu-item-ext_id').click();

      await page
        .locator(
          'data-testid=MappingRow-container >> input[type=checkbox] >> nth=1'
        )
        .check();
      await page
        .locator(
          'data-testid=MappingRow-container >> div[role=combobox] >> nth=1'
        )
        .click();
      await page
        .locator('data-testid=FieldSelect-menu-item-field:first_name')
        .click();

      await page
        .locator(
          'data-testid=MappingRow-container >> input[type=checkbox] >> nth=2'
        )
        .check();
      await page
        .locator(
          'data-testid=MappingRow-container >> div[role=combobox] >> nth=2'
        )
        .click();
      await page
        .locator('data-testid=FieldSelect-menu-item-field:last_name')
        .click();

      await page
        .locator(
          'data-testid=MappingRow-container >> input[type=checkbox] >> nth=3'
        )
        .check();
      await page
        .locator(
          'data-testid=MappingRow-container >> div[role=combobox] >> nth=3'
        )
        .click();
      await page.locator('data-testid=FieldSelect-menu-item-email').click();

      const preview: ImportPreview = {
        problems: [],
        stats: {
          person: {
            summary: {
              addedToOrg: {
                byOrg: {
                  1: 1,
                },
                total: 1,
              },
              created: {
                total: 1,
              },
              tagged: {
                byTag: {},
                total: 0,
              },
              updated: {
                byChangedField: {
                  email: 1,
                },
                byInitializedField: {},
                total: 1,
              },
            },
          },
        },
      };

      const { log: previewLog } = moxy.setZetkinApiMock(
        '/orgs/1/bulk/preview',
        'post',
        preview
      );

      await page.locator('data-testid=ImportFooter-primary-button').click();

      const importOperations: { ops: BulkOp[] } = {
        ops: [
          {
            key: { ext_id: '1' },
            op: 'person.get',
            ops: [
              {
                data: {
                  email: 'clara@example.com',
                  ext_id: '1',
                  last_name: 'Zetkin',
                },
                op: 'person.setfields',
              },
            ],
          },
          {
            key: { ext_id: '2' },
            op: 'person.get',
            ops: [
              {
                data: {
                  email: 'rosa@example.com',
                  ext_id: '2',
                  first_name: 'Rosa',
                },
                op: 'person.setfields',
              },
            ],
          },
        ],
      };

      expect(previewLog().length).toEqual(1);
      expect(previewLog()[0].data).toEqual(importOperations);

      const importResult: PersonImport = {
        accepted: '',
        completed: '',
        report: preview.stats,
        status: 'completed',
      };

      const { log: executeLog } = moxy.setZetkinApiMock(
        '/orgs/1/bulk/execute',
        'post',
        importResult
      );

      await page.locator('data-testid=ImportFooter-primary-button').click();

      expect(executeLog().length).toEqual(1);
      expect(executeLog()[0].data).toEqual(importOperations);
    });
  }
);
