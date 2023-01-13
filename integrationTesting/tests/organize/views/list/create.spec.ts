import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../mockData/orgs/KPD/people/views/NewView/columns';

test.describe.skip('Views list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user create a new view and redirects to that view detail page', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/people/views/2', 'get', NewView);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'post', NewView, 203);
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/${NewView.id}/columns`,
      'post',
      NewViewColumns[0]
    );
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/${NewView.id}/columns`,
      'get',
      NewViewColumns
    );

    await page.goto(appUri + '/organize/1/people');

    await Promise.all([
      page.waitForNavigation(),
      page.click('data-testid=create-view-action-button'),
    ]);

    // Get POST requests for creating new view and columns
    const columnPostLogs = moxy
      .log<{ title: string }>()
      .filter(
        (log) =>
          log.path === `/v1/orgs/1/people/views/${NewView.id}/columns` &&
          log.method === 'POST'
      );
    const viewPostLogs = moxy
      .log<{ title: string }>()
      .filter(
        (log) => log.path === '/v1/orgs/1/people/views' && log.method === 'POST'
      );

    // Expect requests to be made
    expect(viewPostLogs).toHaveLength(1);
    expect(columnPostLogs).toHaveLength(2);
    // Expect that correctly localised strings sent when posting
    expect(viewPostLogs[0].data?.title).toEqual('New View');
    expect(columnPostLogs[0].data?.title).toEqual('First name');
    expect(columnPostLogs[1].data?.title).toEqual('Last name');

    // Expect that user is navigated to new view's page
    await expect(page.url()).toEqual(
      appUri + `/organize/1/people/views/${NewView.id}`
    );
  });

  test('shows an error dialog if there is an error creating the new view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'post', undefined, 500);

    await page.goto(appUri + '/organize/1/people');
    await page.click('data-testid=create-view-action-button');

    await page.locator('data-testid=create-view-error-dialog').waitFor();
    // Expect error dialog to exist on page
    expect(
      await page.locator('data-testid=create-view-error-dialog').count()
    ).toEqual(1);
  });
});
