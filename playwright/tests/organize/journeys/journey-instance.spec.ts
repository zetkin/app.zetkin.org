import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ClarasOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Journey instance page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows journey instance', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
      'get',
      MemberOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}/instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    await page.goto(appUri + '/organize/1/journeys/1/instances/1');

    expect(
      await page.locator(`text=${ClarasOnboarding.title}`).count()
    ).toEqual(1);
  });
});
