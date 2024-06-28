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

  test('allows title to be changed', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/v1/orgs/1/people/views/1', 'patch');

    const inputSelector = 'data-testid=page-title >> input';

    // Click to edit, fill and submit change
    await page.goto(appUri + '/organize/1/people/lists/1');
    await page.click(inputSelector);
    await page.fill(inputSelector, 'Friends of Zetkin');
    await Promise.all([
      page.waitForResponse('**/orgs/1/people/views/1'),
      page.keyboard.press('Enter'),
    ]);

    // Check body of request
    const titleUpdateRequest = moxy
      .log()
      .find(
        (mock) =>
          mock.method === 'PATCH' && mock.path === '/v1/orgs/1/people/views/1'
      );
    expect(titleUpdateRequest?.data).toEqual({ title: 'Friends of Zetkin' });
  });
});
