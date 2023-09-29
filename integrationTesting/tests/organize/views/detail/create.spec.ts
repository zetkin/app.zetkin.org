import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../mockData/orgs/KPD/people/views/NewView/columns';

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user create a new view from selection', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers, NewView]);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );

    moxy.setZetkinApiMock('/orgs/1/people/views', 'post', NewView, 203);
    moxy.setZetkinApiMock(
      `/orgs/1/people/views/${NewView.id}/columns`,
      'post',
      NewViewColumns[0]
    );
    moxy.setZetkinApiMock(`/orgs/1/people/views/${NewView.id}/rows/1`, 'put', {
      content: ['Clara', 'Zetkin'],
      id: 1,
    });
    moxy.setZetkinApiMock(`/orgs/1/people/views/${NewView.id}/rows/2`, 'put', {
      content: ['Clara', 'Zetkin'],
      id: 1,
    });

    await page.goto(appUri + '/organize/1/people/lists/1');

    await page.locator('[role=cell] >> input[type=checkbox]').nth(0).click();
    await page.locator('[role=cell] >> input[type=checkbox]').nth(1).click();

    await Promise.all([
      page.waitForNavigation(),
      page.click('data-testid=ViewDataTableToolbar-createFromSelection'),
    ]);

    // Get POST requests for creating new view and columns
    const moxyLog = moxy.log<{ title: string }>();
    const columnPostLogs = moxyLog.filter(
      (log) =>
        log.path == `/v1/orgs/1/people/views/${NewView.id}/columns` &&
        log.method == 'POST'
    );
    const viewPostLogs = moxyLog.filter(
      (log) => log.path == '/v1/orgs/1/people/views' && log.method == 'POST'
    );
    const rowPutLogs = moxyLog.filter(
      (log) =>
        log.path.startsWith(`/v1/orgs/1/people/views/${NewView.id}/rows/`) &&
        log.method == 'PUT'
    );

    // Expect requests to be made
    expect(viewPostLogs).toHaveLength(1);
    expect(columnPostLogs).toHaveLength(2);

    // Expect that correctly localised strings sent when posting
    expect(viewPostLogs[0].data?.title).toEqual('New list');
    expect(columnPostLogs[0].data?.title).toEqual('First Name');
    expect(columnPostLogs[1].data?.title).toEqual('Last Name');

    // Expect that the correct rows were added
    expect(rowPutLogs[0].path).toMatch(/1$/);
    expect(rowPutLogs[1].path).toMatch(/2$/);

    // Expect that user is navigated to new view's page
    expect(page.url()).toEqual(
      appUri + `/organize/1/people/lists/${NewView.id}`
    );
  });
});
