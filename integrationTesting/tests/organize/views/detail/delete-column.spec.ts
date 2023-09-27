import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user delete an existing column', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Delete first column
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'DELETE'),
      (async () => {
        await page.hover('[role=columnheader]:has-text("First name")');
        await page.click(
          '[role=columnheader]:has-text("First name") [aria-label=Menu]'
        );
        await page.click(
          `data-testid=delete-column-button-col_${AllMembersColumns[0].id}`
        );
      })(),
    ]);

    // Check body of request
    const columnDeleteRequest = moxy
      .log()
      .find(
        (mock) =>
          mock.method === 'DELETE' &&
          mock.path ===
            `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`
      );
    expect(columnDeleteRequest).not.toEqual(undefined);
  });

  test('shows error snackbar if there is an error deleting the column', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
      'delete',
      undefined,
      400
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Delete first column
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'DELETE'),
      (async () => {
        await page.hover('[role=columnheader]:has-text("First name")');
        await page.click(
          '[role=columnheader]:has-text("First name") [aria-label=Menu]'
        );
        await page.click(
          `data-testid=delete-column-button-col_${AllMembersColumns[0].id}`
        );
      })(),
    ]);

    await page.locator('data-testid=Snackbar-error').waitFor();

    expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
  });

  test('the user must confirm deletion of a column with local data', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Delete local column
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'DELETE'),
      (async () => {
        await page.hover('[role=columnheader]:has-text("Active")');
        await page.click(
          '[role=columnheader]:has-text("Active") [aria-label=Menu]'
        );
        await page.click(
          `data-testid=delete-column-button-col_${AllMembersColumns[2].id}`
        );
        await page.click('button:text("Confirm")');
      })(),
    ]);

    // Check body of request
    const columnDeleteRequest = moxy
      .log()
      .find(
        (mock) =>
          mock.method === 'DELETE' &&
          mock.path ===
            `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[2].id}`
      );
    expect(columnDeleteRequest).not.toEqual(undefined);
  });
});
