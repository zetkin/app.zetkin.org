import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';
import { VisitLinkConfig } from '../../../../src/types/tasks';
import VisitReferendumWebsite from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/VisitReferendumWebsite';

test.describe('Single campaign page speed dial', () => {
  test.beforeEach(({ moxy, login }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test.describe('creating a task from speed dial', () => {
    test.beforeEach(async ({ moxy }) => {
      // All campaigns request for create task campaign select options
      moxy.setZetkinApiMock('/orgs/1/campaigns', 'get', [ReferendumSignatures]);
    });

    test('user can create an offline task', async ({ page, appUri, moxy }) => {
      // Submit create task form response
      const { log } = moxy.setZetkinApiMock(
        '/orgs/1/tasks',
        'post',
        SpeakToFriend,
        201
      );

      // Response for task detail page
      moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', SpeakToFriend);

      // Open create task modal with URL
      await page.goto(appUri + '/organize/1/campaigns/1#create-task');

      // Fill form
      await page.fill('#title', SpeakToFriend.title);
      await page.fill('#instructions', SpeakToFriend.instructions);
      await page.fill('input:near(#type)', SpeakToFriend.type);

      await page.click('button > :text("Submit")');
      await page.waitForResponse('**/orgs/1/tasks');
      expect(log<{ config: unknown }>()[0].data?.config).toEqual({});

      await page.waitForNavigation(); // Closing the modal
      await page.waitForNavigation(); // Redirecting to new page

      expect(page.url()).toEqual(
        appUri + '/organize/1/campaigns/1/calendar/tasks/' + SpeakToFriend.id
      );
    });

    test('user can create a visit link task', async ({
      page,
      appUri,
      moxy,
    }) => {
      // Submit create task form response
      const { log } = moxy.setZetkinApiMock(
        '/orgs/1/tasks',
        'post',
        VisitReferendumWebsite,
        201
      );

      // Response for task detail page
      moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', VisitReferendumWebsite);

      // Open create task modal with URL
      await page.goto(appUri + '/organize/1/campaigns/1#create-task');

      // Fill form
      await page.fill('#title', VisitReferendumWebsite.title);
      await page.fill('#instructions', VisitReferendumWebsite.instructions);
      await page.fill('input:near(#type)', VisitReferendumWebsite.type);
      await page.fill('#url', VisitReferendumWebsite.config.url as string);

      await page.click('button > :text("Submit")');
      await page.waitForResponse('**/orgs/1/tasks');
      expect(log<{ config: VisitLinkConfig }>()[0].data?.config).toEqual({
        url: VisitReferendumWebsite.config.url,
      });
    });

    test('shows error alert when response error', async ({
      page,
      moxy,
      appUri,
    }) => {
      moxy.setZetkinApiMock('/orgs/1/tasks', 'post', undefined, 400);

      await page.goto(appUri + '/organize/1/campaigns/1#create-task');

      // No error alert on page load
      await expect(page.locator('data-testid=error-alert')).toBeHidden();

      // Fill form
      await page.fill('#title', SpeakToFriend.title);
      await page.fill('#instructions', SpeakToFriend.instructions);
      await page.fill('input:near(#type)', SpeakToFriend.type);
      await page.click('button > :text("Submit")');

      // Shows alert
      await expect(page.locator('data-testid=error-alert')).toBeVisible();
      // Does not navigate and keeps open modal
      await expect(page.url()).toEqual(
        appUri + '/organize/1/campaigns/1#create-task'
      );
    });
  });
});
