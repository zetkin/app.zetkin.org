import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriendAboutReferendum from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';
import VisitReferendumWebsite from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/VisitReferendumWebsite';

test.describe('Campaign detail page', async () => {
  test.beforeEach(async ({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('displays a list of tasks', async ({ page, moxy, appUri }) => {
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', [
      SpeakToFriendAboutReferendum,
      VisitReferendumWebsite,
    ]);

    await page.goto(appUri + '/organize/1/projects/1');

    await expect(
      page.locator('text=Speak to friend about the referendum')
    ).toBeVisible();
    await expect(
      page.locator('text=Learn more about the referrendum')
    ).toBeVisible();
  });

  test('shows a button to create new task if there are no tasks', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', []);

    await page.goto(appUri + '/organize/1/projects/1');

    await expect(page.locator('text=No tasks')).toBeVisible();
  });
});
