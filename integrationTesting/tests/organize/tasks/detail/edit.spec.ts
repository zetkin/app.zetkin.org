import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ReferendumSignatureCollection from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

test.describe('Task detail page', async () => {
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

  const newTitle = 'Speak to a family member';

  test('lets user edit task details', async ({ page, moxy, appUri }) => {
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'patch', {
      ...SpeakToFriend,
      title: newTitle,
    });

    await page.goto(appUri + '/organize/1/projects/1/calendar/tasks/1');

    // Open modal
    await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
    await page.click('data-testid=ZUIEllipsisMenu-item-editTask');

    moxy.removeMock('/orgs/1/tasks/1', 'get'); // Remove existing mock
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', {
      // After editing
      ...SpeakToFriend,
      title: newTitle,
    });

    // Edit task
    await page.fill('#title', newTitle);
    await page.click('button:text("Submit")');

    // Check that title changes on page
    const taskTitle = page.locator('data-testid=page-title');
    await expect(taskTitle).toContainText(newTitle);
  });

  test('shows error alert if server error on request', async ({
    appUri,
    page,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'patch', {}, 401);

    await page.goto(appUri + '/organize/1/projects/1/calendar/tasks/1');

    // Open modal
    await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
    await page.click('data-testid=ZUIEllipsisMenu-item-editTask');

    // Edit task
    await page.fill('#title', newTitle);
    await page.click('button:text("Submit")');

    // Check that alert shows
    await expect(page.locator('data-testid=error-alert')).toBeVisible();
  });
});
