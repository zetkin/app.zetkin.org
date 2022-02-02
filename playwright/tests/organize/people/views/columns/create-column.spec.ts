import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Creating a view column', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    // Rows with only data of first two columns
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/rows',
      'get',
      AllMembersRows.map((row) => {
        return { ...row, content: [row.content[0], row.content[1]] };
      })
    );
    // Only first two columns
    moxy.setZetkinApiMock('/orgs/1/people/views/1/columns', 'get', [
      AllMembersColumns[0],
      AllMembersColumns[1],
    ]);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('the user can create a new column', async ({ page, appUri, moxy }) => {
    // Mock for post req to create new column
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'post',
      AllMembersColumns[2],
      201
    );

    await page.goto(appUri + '/organize/1/people/views/1');

    // Remove existing mocks
    moxy.removeMock();

    // Replace mocks
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );

    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);

    // Create new toggle column
    await page.click('data-testid=ViewDataTableToolbar-createColumn');
    await page.click('data-testid=column-type-selector-local_bool');

    // Check body of request
    const columnPostReq = moxy
      .log()
      .find(
        (mock) =>
          mock.method === 'POST' &&
          mock.path === '/v1/orgs/1/people/views/1/columns'
      );
    expect(columnPostReq?.data).toEqual({
      title: 'Toggle',
      type: 'local_bool',
    });
  });

  test('shows an error modal if there is an error creating the column', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'post',
      undefined,
      404
    );

    await page.goto(appUri + '/organize/1/people/views/1');

    // Create new toggle column
    await page.click('data-testid=ViewDataTableToolbar-createColumn');
    await page.click('data-testid=column-type-selector-local_bool');

    expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
  });
});
