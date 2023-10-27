import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import WelcomeNewMembers from '../../../../mockData/orgs/KPD/campaigns/WelcomeNewMembers';

test.describe('Campaigns list page ', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows list of campaigns ', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/campaigns', 'get', [
      ReferendumSignatures,
      WelcomeNewMembers,
    ]);

    await page.goto(appUri + '/organize/1/projects');

    const numCampaignCards = await page.$$eval(
      'data-testid=campaign-card',
      (items) => items.length
    );
    expect(numCampaignCards).toEqual(2);
  });
});
