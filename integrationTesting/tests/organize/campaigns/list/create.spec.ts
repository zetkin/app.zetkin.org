import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import WelcomeNewMembers from '../../../../mockData/orgs/KPD/campaigns/WelcomeNewMembers';

test.describe.skip('Campaigns list page', async () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/campaigns', 'get', [WelcomeNewMembers]);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user create a new campaign', async ({ appUri, page, moxy }) => {
    moxy.setZetkinApiMock(
      '/orgs/1/campaigns',
      'post',
      ReferendumSignatures,
      201
    );
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', []);

    await page.goto(appUri + '/organize/1/campaigns#create-campaign');

    // Fill form
    await page.fill('#title', ReferendumSignatures.title);
    await page.fill('#info_text', ReferendumSignatures.info_text);
    await page.fill('input:near(#status)', 'published');
    await page.fill('input:near(#visibility)', ReferendumSignatures.visibility);

    await Promise.all([
      // Page may navigate away from modal (#createCampaign) before it
      // navigates to the new campaign, so wait for specific URL
      page.waitForNavigation({
        url: `**/organize/1/campaigns/${ReferendumSignatures.id}`,
      }),
      page.click('button:text("Submit")'),
    ]);

    // Check for redirect
    expect(page.url()).toEqual(
      appUri + '/organize/1/campaigns/' + ReferendumSignatures.id
    );
  });

  test('shows error alert when there is a response error', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/tasks', 'post', {}, 400);

    await page.goto(appUri + '/organize/1/campaigns#create-campaign');

    // No error alert on page load
    await expect(page.locator('data-testid=error-alert')).toBeHidden();

    // Fill form
    await page.fill('#title', ReferendumSignatures.title);
    await page.fill('#info_text', ReferendumSignatures.info_text);
    await page.fill('input:near(#status)', 'published');
    await page.fill('input:near(#visibility)', ReferendumSignatures.visibility);
    await page.click('button:text("Submit")');

    // Shows alert
    await expect(page.locator('data-testid=error-alert')).toBeVisible();
    // Does not navigate and keeps open modal
    await expect(page.url()).toEqual(
      appUri + '/organize/1/campaigns#create-campaign'
    );
  });
});
