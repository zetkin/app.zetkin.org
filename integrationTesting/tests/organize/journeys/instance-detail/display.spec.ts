import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Journey instance detail page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('displays journey instance', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
      'get',
      MemberOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    const title = page.locator(
      `[data-testid=page-title]:has-text("${ClarasOnboarding.title}")`
    );
    const breadcrumbTitle = page.locator(
      `[aria-label=breadcrumb]:has-text("${ClarasOnboarding.title}")`
    );

    await Promise.all([
      page.goto(appUri + '/organize/1/journeys/1/1'),
      title.waitFor({ state: 'visible' }),
      breadcrumbTitle.waitFor({ state: 'visible' }),
    ]);

    const numTitles = await title.count();
    const numBreadcrumbTitles = await breadcrumbTitle.count();

    expect(numTitles).toEqual(1);
    expect(numBreadcrumbTitles).toEqual(1);
  });
});
