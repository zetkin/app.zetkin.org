import { expect } from '@playwright/test';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import test from '../../../../fixtures/next';

test.describe('Journey instance list', () => {
  test.beforeEach(({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/journeys/1', 'get', MemberOnboarding);
    moxy.setZetkinApiMock('/orgs/1/journeys/1/instances', 'get', [
      ClarasOnboarding,
      {
        ...ClarasOnboarding,
        id: ClarasOnboarding.id + 1,
        tags: [],
        title: 'Another onboarding',
      },
      {
        ...ClarasOnboarding,
        id: ClarasOnboarding.id + 2,
        tags: [],
        title: 'Better onboarding',
      },
    ]);
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('persists sort and filter state', async ({ appUri, page }) => {
    await page.goto(appUri + '/organize/1/journeys/1');

    // Open filters dialog
    await page.locator('text=FILTERS').click();

    // Configure filters to only show instances with no tags
    await page
      .locator('label:text("Columns") + * select')
      .selectOption({ label: 'Tags' });
    await page
      .locator('select:has-text("Has")')
      .selectOption({ label: 'is empty' });

    // Click title header twice to sort descending
    await page.locator('[role=columnheader]:has-text("title")').click();
    await page.locator('[role=columnheader]:has-text("title")').click();

    // Check that there are three rows (including header) and
    // that they are sorted reverse alphabetically
    const rows = page.locator('[role=row]');
    const firstRow = rows.nth(1);
    await firstRow.waitFor();
    const secondRow = rows.nth(2);
    await secondRow.waitFor();

    expect(firstRow).toContainText('Better');
    expect(secondRow).toContainText('Another');
    expect(await rows.count()).toBe(3);

    // Reload the page
    await page.reload();

    // Check that grid state persisted
    const rowsAfterRefresh = page.locator('[role=row]');
    const firstRowAfterRefresh = rowsAfterRefresh.nth(1);
    await firstRowAfterRefresh.waitFor();
    const secondRowAfterRefresh = rowsAfterRefresh.nth(2);
    await secondRowAfterRefresh.waitFor();

    expect(firstRowAfterRefresh).toContainText('Better');
    expect(secondRowAfterRefresh).toContainText('Another');
    expect(await rowsAfterRefresh.count()).toBe(3);

    await page.waitForTimeout(5000);
  });
});
