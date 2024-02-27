import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import KPD from '../../../../mockData/orgs/KPD';

test.describe('Views list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test.skip('informs user they do not have any views if list is empty', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);

    await page.goto(appUri + '/organize/1/people');
    expect(
      await page.locator('data-testid=empty-views-list-indicator').count()
    ).toEqual(1);
  });

  test('displays available views to the user', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/view_folders', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [
      AllMembers,
      {
        created: '2021-11-21T12:59:19',
        id: 2,
        owner: {
          id: 1,
          name: 'Rosa Luxemburg',
        },
        title: 'Second View',
      },
    ]);

    const rows = page.locator('.MuiDataGrid-row');

    await page.goto(appUri + '/organize/1/people');
    await rows.first().waitFor({ state: 'visible' });

    const numRows = await rows.count();
    expect(numRows).toEqual(2);
  });
});
