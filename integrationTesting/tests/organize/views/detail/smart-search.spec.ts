import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers, NewView]);
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

  test.skip('lets user configure Smart Search query in empty view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/people/queries/1', 'patch', {
      filter_spec: [
        {
          config: {},
          op: 'add',
          type: 'all',
        },
      ],
      id: 1,
    });

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Configure Smart Search query
    await page.click('data-testid=EmptyView-configureButton');
    await page.click('data-testid=StartsWith-select');
    await page.click('data-testid=StartsWith-select-all');
    await page.click('data-testid=FilterForm-saveButton');

    await Promise.all([
      page.waitForResponse('**/orgs/1/people/views/1/rows'),
      page.click('data-testid=QueryOverview-saveButton'),
    ]);

    // Make sure previous content query was deleted
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'PATCH' &&
            req.path === '/v1/orgs/1/people/views/1/content_query'
        )?.data
    ).toMatchObject({
      filter_spec: [
        {
          config: {},
          op: 'add',
          type: 'all',
        },
      ],
    });

    // Make sure rows are fetched anew
    expect(
      moxy
        .log()
        .filter(
          (req) =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows'
        ).length
    ).toBeGreaterThan(1);
  });
});
