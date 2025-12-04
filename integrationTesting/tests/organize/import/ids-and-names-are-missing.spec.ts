import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import mockCsv from '../../../mockFiles/mockCsv';

test.describe(
  'When importing with external id, first name and last name from a file where IDs and names are missing',
  () => {
    test.beforeEach(({ login }) => {
      login();
    });

    test.afterEach(({ moxy }) => {
      moxy.teardown();
    });

    test('there is a MISSING_ID_AND_NAME problem and no request is made to /preview', async ({
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
        ['', '', 'Zetkin', 'clara@example.com'],
        ['', 'Rosa', '', 'rosa@example.com'],
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
        .locator('data-testid=IdConfig-importID-checkbox-ext_id')
        .check();

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

      const { log: previewLog } = moxy.setZetkinApiMock(
        '/orgs/1/bulk/preview',
        'post',
        {}
      );

      await page.locator('data-testid=ImportFooter-primary-button').click();

      expect(previewLog().length).toEqual(0);

      const alert = page
        .getByRole('alert')
        .filter({ has: page.getByText('Not all rows have identifiers') });
      await expect(alert).toContainText(
        'Every row needs to contain at least a full name, or an ID of a person that already exists in Zetkin.'
      );

      await expect(alert).toContainText('This problem exists on rows 2 and 3');
    });
  }
);
