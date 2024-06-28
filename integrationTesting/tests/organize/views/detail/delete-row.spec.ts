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

  test('lets user remove row from view', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock(
      '/v1/orgs/1/people/views/1/rows/1',
      'delete',
      undefined,
      204
    );

    const removeButton = 'data-testid=ViewDataTableToolbar-removeFromSelection';
    const confirmButtonInModal = 'button:has-text("confirm")';
    await page.goto(appUri + '/organize/1/people/lists/1');

    // Show toolbar button on row selection
    await expect(page.locator(removeButton)).toBeHidden();
    await page.locator('[role=row] input[type=checkbox]').first().click();
    await page.locator(removeButton).waitFor();
    await expect(page.locator(removeButton)).toBeVisible();

    // Show modal on click remove button -> click confirm to close modal
    await page.locator(removeButton).click();
    await expect(page.locator(confirmButtonInModal)).toBeVisible();
    await page.locator(confirmButtonInModal).click();
    await expect(page.locator(confirmButtonInModal)).toBeHidden();

    // Check for delete request
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/rows/1'
        )
    ).toBeTruthy();
  });
});
