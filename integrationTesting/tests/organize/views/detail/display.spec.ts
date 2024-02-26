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

  test('displays view title and content to the user', async ({
    page,
    appUri,
  }) => {
    const members = page.locator('text=All KPD members >> visible=true');
    const clara = page.locator('main >> text=Clara');
    const rosa = page.locator('main >> text=Rosa');

    await Promise.all([
      page.goto(appUri + '/organize/1/people/lists/1'),
      members.first().waitFor({ state: 'visible' }),
      clara.first().waitFor({ state: 'visible' }),
      rosa.first().waitFor({ state: 'visible' }),
    ]);

    const numMembers = await members.count();
    const numClara = await clara.count();
    const numRosa = await rosa.count();

    expect(numMembers).toEqual(1);
    expect(numClara).toEqual(1);
    expect(numRosa).toEqual(1);
  });
});
