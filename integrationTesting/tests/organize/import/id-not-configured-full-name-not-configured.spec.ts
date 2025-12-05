import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import mockCsv from '../../../mockFiles/mockCsv';

test.describe(
  'When importing without id, and only first name from a file where first names and last names are present',
  () => {
    test.beforeEach(({ login }) => {
      login();
    });

    test.afterEach(({ moxy }) => {
      moxy.teardown();
    });

    test('there is a UNCONFIGURED_ID_AND_NAME problem and no request is made to /preview', async ({
      appUri,
      moxy,
      page,
    }) => {
      moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);
      await page.goto(appUri + '/organize/1/people');
      await page.locator('data-testid=ZUIButtonMenu-button').click();
      await page.locator('data-testid=import-people').click();
      const data = mockCsv([
        ['first', 'last', 'email'],
        ['Clara', 'Zetkin', 'clara@example.com'],
        ['Rosa', 'Luxemburg', 'rosa@example.com'],
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
      await page.locator('data-testid=FieldSelect-menu-item-email').click();

      const { log: previewLog } = moxy.setZetkinApiMock(
        '/orgs/1/bulk/preview',
        'post',
        {}
      );

      await page.locator('data-testid=ImportFooter-primary-button').click();

      expect(previewLog().length).toEqual(0);

      const alert = page.getByRole('alert').filter({
        has: page.getByText('You have not configured identifying columns'),
      });
      await expect(alert).toContainText(
        'Every import must at least include either full names, or IDs of people that already exist in Zetkin.'
      );
    });
  }
);
