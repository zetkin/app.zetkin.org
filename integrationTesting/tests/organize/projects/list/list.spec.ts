import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/projects/ReferendumSignatures';
import WelcomeNewMembers from '../../../../mockData/orgs/KPD/projects/WelcomeNewMembers';

test.describe('Projects list page ', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows list of projects ', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/area_assignments', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/emails', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/call_assignments', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/surveys', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/campaigns', 'get', [
      ReferendumSignatures,
      WelcomeNewMembers,
    ]);

    const projectCards = page.locator('data-testid=project-card');

    await page.goto(appUri + '/organize/1/campaigns');
    await projectCards.first().waitFor({ state: 'visible' });

    const numProjectCards = await projectCards.count();
    expect(numProjectCards).toEqual(2);
  });
});
