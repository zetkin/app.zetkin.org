import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import MarxistTraining from '../../../mockData/orgs/KPD/journeys/MarxistTraining';
import MemberOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Journeys list page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows list of journeys', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock('/orgs/1/journeys', 'get', [
      MemberOnboarding,
      MarxistTraining,
    ]);

    const journeyCards = page.locator('data-testid=journey-card');

    await page.goto(appUri + '/organize/1/journeys');
    await journeyCards.first().waitFor({ state: 'visible' });

    const numJourneysCards = await journeyCards.count();
    expect(numJourneysCards).toEqual(2);
  });
});
