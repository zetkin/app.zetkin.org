import { expect, Page } from '@playwright/test';

import test, { NextWorkerFixtures } from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import KPD from '../../../../mockData/orgs/KPD';

const deleteView = async (page: Page) => {
  await page.click('main [data-testid=ZUIEllipsisMenu-menuActivator]');
  await page.click(`data-testid=ZUIEllipsisMenu-item-delete-item`);
  await page.click('button:text("Confirm")');
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

test.describe('Views list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user delete a view', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers]);
    moxy.setZetkinApiMock('/orgs/1/people/view_folders', 'get', []);
    moxy.setZetkinApiMock(
      `/orgs/1/people/1/views/${AllMembers.id}`,
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/people');

    await deleteView(page);
    expectDeleteViewSuccess(moxy);
  });
});
