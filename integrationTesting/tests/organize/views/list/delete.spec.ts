import { expect, Page } from '@playwright/test';

import test, { NextWorkerFixtures } from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import KPD from '../../../../mockData/orgs/KPD';

const deleteView = async (page: Page) => {
  await page
    .locator('main [data-testid=ZUIEllipsisMenu-menuActivator]')
    .first()
    .click();
  await page.click(`data-testid=ZUIEllipsisMenu-item-delete-item`);
  await page.click('data-testid=SubmitCancelButtons-submitButton');
};

const expectDeleteViewSuccess = async (moxy: NextWorkerFixtures['moxy']) => {
  await expect
    .poll(() =>
      moxy
        .log()
        .some(
          (mock) =>
            mock.method === 'DELETE' &&
            mock.path.includes(`/orgs/1/people/views/${AllMembers.id}`)
        )
    )
    .toBe(true);
};

test.describe('Views list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user delete a view', async ({ page, appUri, moxy }) => {
    // getServerSideProps verifies that the user may access views
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers]);
    moxy.setZetkinApiMock('/orgs/1/people/view_folders', 'get', []);

    // ViewBrowser loads items via Next API endpoint /api/views/tree
    await page.route(/\/api\/views\/tree\?orgId=1\b/, async (route) => {
      await route.fulfill({
        json: { data: { folders: [], views: [AllMembers] } },
      });
    });
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/${AllMembers.id}`,
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/people');

    await page
      .locator('main [data-testid=ZUIEllipsisMenu-menuActivator]')
      .first()
      .waitFor({ state: 'visible' });
    await deleteView(page);
    await expectDeleteViewSuccess(moxy);
  });
});
