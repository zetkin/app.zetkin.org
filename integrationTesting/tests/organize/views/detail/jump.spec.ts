import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import AllCustomFields from '../../../../mockData/orgs/KPD/people/views/AllMembers/fields';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../mockData/orgs/KPD/people/views/NewView/columns';

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/people/fields', 'get', AllCustomFields);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );

    // Mocks for NewView, which jump menu navigates to
    moxy.setZetkinApiMock('/orgs/1/people/views/2', 'get', NewView);
    moxy.setZetkinApiMock('/orgs/1/people/views/2/rows', 'get', []);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/2/columns',
      'get',
      NewViewColumns
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('jumps between views using jump menu', async ({ page, appUri }) => {
    await page.route(/\/api\/views\/tree\?orgId=1\b/, async (route) => {
      await route.fulfill({
        json: { data: { folders: [], views: [AllMembers, NewView] } },
      });
    });
    await page.goto(appUri + '/organize/1/people/lists/1');

    // Click to open the jump menu
    await page.click('data-testid=view-jump-menu-button');

    // Assert that the input is automatically focused, and type in part of the title of NewView
    await expect(
      page.locator('data-testid=view-jump-menu-popover >> input')
    ).toBeFocused();
    await page.fill(
      'data-testid=view-jump-menu-popover >> input',
      NewView.title.slice(0, 3)
    );

    // Press down to select view and enter to navigate
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Assert that we navigate away to the new view
    await page.waitForURL(appUri + `/organize/1/people/lists/${NewView.id}`);
  });
});
