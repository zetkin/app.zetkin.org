import { expect, Page } from '@playwright/test';
import test, { NextWorkerFixtures } from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';

const deleteView = async (page: Page) => {
  await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
  await page.click(`data-testid=ZUIEllipsisMenu-item-delete-view`);
  await page.click('button:text("Confirm")');
};

const expectDeleteViewError = async (page: Page) => {
  await page.locator('data-testid=Snackbar-error').waitFor();
  const canSeeErrorSnackbar = await page
    .locator('data-testid=Snackbar-error')
    .isVisible();
  expect(canSeeErrorSnackbar).toBeTruthy();
};

const expectDeleteViewSuccess = (moxy: NextWorkerFixtures['moxy']) => {
  const deleteViewRequest = moxy
    .log()
    .find(
      (mock) =>
        mock.method === 'DELETE' &&
        mock.path === `/v1/orgs/1/people/views/${AllMembers.id}`
    );
  expect(deleteViewRequest).toBeTruthy();
};

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user delete the view', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'delete', undefined, 204);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Wait for navigation after deleting
    await Promise.all([
      (async () => {
        // Check that the request to delete was made successfully
        await page.waitForResponse(
          (res) =>
            res.request().method() === 'DELETE' &&
            res
              .request()
              .url()
              .includes(`/orgs/1/people/views/${AllMembers.id}`)
        );
        expectDeleteViewSuccess(moxy);
      })(),
      page.waitForNavigation(),
      deleteView(page),
    ]);

    // Check navigates back to views list
    await expect(page.url()).toEqual(appUri + `/organize/${KPD.id}/people`);
  });

  test('shows error snackbar if error deleting view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'delete', undefined, 405);

    await page.goto(appUri + '/organize/1/people/lists/1');

    await deleteView(page);
    await expectDeleteViewError(page);
  });
});
