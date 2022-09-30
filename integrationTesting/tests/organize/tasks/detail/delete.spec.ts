import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ReferendumSignatureCollection from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

test.describe('Task detail pagee', async () => {
  test.beforeEach(async ({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', SpeakToFriend);
    moxy.setZetkinApiMock(
      '/orgs/1/campaigns/1',
      'get',
      ReferendumSignatureCollection
    );
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test.describe('delete task', () => {
    test('user can delete task', async ({ page, moxy, appUri }) => {
      const { log } = moxy.setZetkinApiMock(
        '/orgs/1/tasks/1',
        'delete',
        {},
        204
      );

      await page.goto(appUri + '/organize/1/campaigns/1/calendar/tasks/1');

      await page.click('data-testid=ZUIEllipsisMenu-menuActivator');
      await page.click('data-testid=ZUIEllipsisMenu-item-deleteTask');

      await Promise.all([
        page.waitForNavigation(),
        page.click('button > :text("Confirm")'),
      ]);

      expect(page.url()).toEqual(appUri + '/organize/1/campaigns/1');
      expect(log().length).toEqual(1);
    });

    test('shows error snackbar if delete task fails', async ({
      page,
      moxy,
      appUri,
    }) => {
      moxy.setZetkinApiMock('/orgs/1/tasks/1', 'delete', {}, 404);

      await page.goto(appUri + '/organize/1/campaigns/1/calendar/tasks/1');

      await page.click('data-testid=ZUIEllipsisMenu-menuActivator');
      await page.click('data-testid=ZUIEllipsisMenu-item-deleteTask');
      await page.click('button > :text("Confirm")');

      await page.locator('data-testid=Snackbar-error').waitFor();
      const canSeeErrorSnackbar = await page
        .locator('data-testid=Snackbar-error')
        .isVisible();
      expect(canSeeErrorSnackbar).toBeTruthy();
    });
  });
});
