import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import { BulkOp, ImportPreview, PersonImport } from 'features/import/types';

test.describe(
  'When importing with id, first name and last name from a file where all values exist',
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
      await page.locator('text=Create').click();
      await page.locator('text=Import people').click();
      await page
        .locator('input')
        .setInputFiles(
          'integrationTesting/tests/organize/import/all-values-exist/test-data.csv'
        );

      await page.locator('input[type=checkbox] >> nth=1').check();
      await page.locator('div[role=combobox] >> nth=0').click();
      await page.locator('text=Zetkin ID').click();

      await page.locator('input[type=checkbox] >> nth=2').check();
      await page.locator('div[role=combobox] >> nth=1').click();
      await page.locator('text=First Name').click();

      await page.locator('input[type=checkbox] >> nth=3').check();
      await page.locator('div[role=combobox] >> nth=2').click();
      await page.locator('text=Last Name').click();

      await page.locator('input[type=checkbox] >> nth=4').check();
      await page.locator('div[role=combobox] >> nth=3').click();
      await page.locator('text=Email >> nth=1').click();

      const preview: ImportPreview = {
        problems: [],
        stats: {
          person: {
            summary: {
              addedToOrg: {
                byOrg: {},
                total: 0,
              },
              created: {
                total: 0,
              },
              tagged: {
                byTag: {},
                total: 0,
              },
              updated: {
                byChangedField: {
                  email: 2,
                  first_name: 2,
                  last_name: 2,
                },
                byInitializedField: {},
                total: 2,
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

      await page.locator('button', { hasText: 'Validate' }).click();

      const importOperations: { ops: BulkOp[] } = {
        ops: [
          {
            key: { id: 1 },
            op: 'person.get',
            ops: [
              {
                data: {
                  email: 'clara@example.com',
                  first_name: 'Clara',
                  last_name: 'Zetkin',
                },
                op: 'person.setfields',
              },
            ],
          },
          {
            key: { id: 2 },
            op: 'person.get',
            ops: [
              {
                data: {
                  email: 'rosa@example.com',
                  first_name: 'Rosa',
                  last_name: 'Luxemburg',
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

      await page.locator('input[type=checkbox] >> nth=0').check();
      await page.locator('input[type=checkbox] >> nth=1').check();
      await page.locator('input[type=checkbox] >> nth=2').check();
      await page.locator('button', { hasText: 'Import' }).click();

      expect(executeLog().length).toEqual(1);
      expect(executeLog()[0].data).toEqual(importOperations);
    });
  }
);
