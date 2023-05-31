import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';

test.describe('Campaign detail page', async () => {
  test.beforeEach(async ({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/call_assignments', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/surveys', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('allows users to delete a campaign', async ({ page, moxy, appUri }) => {
    const { log } = moxy.setZetkinApiMock(
      '/orgs/1/campaigns/1',
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/projects/1');

    await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
    await page.click('data-testid=ZUIEllipsisMenu-item-deleteCampaign');

    await Promise.all([
      page.waitForNavigation(),
      page.click('button:text("Confirm")'),
    ]);

    expect(page.url()).toEqual(appUri + '/organize/1/projects');
    expect(log().length).toEqual(1);
  });

  test('shows error snackbar if delete campaign fails', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'delete', undefined, 400);

    await page.goto(appUri + '/organize/1/projects/1');

    await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
    await page.click('data-testid=ZUIEllipsisMenu-item-deleteCampaign');
    await page.click('button:text("Confirm")');

    await page.locator('data-testid=Snackbar-error').waitFor();
    const canSeeErrorSnackbar = await page
      .locator('data-testid=Snackbar-error')
      .isVisible();
    expect(canSeeErrorSnackbar).toBeTruthy();

    expect(page.url()).toEqual(appUri + '/organize/1/projects/1');
  });
});
