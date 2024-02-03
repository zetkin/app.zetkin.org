import { expect } from '@playwright/test';

import ClarasOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import KPD from '../../../mockData/orgs/KPD';
import MarxistTraining from '../../../mockData/orgs/KPD/journeys/MarxistTraining';
import MemberOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import test from '../../../fixtures/next';

test.describe('Profile page journeys section', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/journey_instances`,
      'get',
      [ClarasOnboarding]
    );

    moxy.setZetkinApiMock(`/orgs/${KPD.id}/journeys`, 'get', [
      MarxistTraining,
      MemberOnboarding,
    ]);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('displays relevant journey instances', async ({ appUri, page }) => {
    await page.goto(appUri + `/organize/${KPD.id}/people/${ClaraZetkin.id}`);

    await expect(
      page.locator('data-testid=PersonJourneysCard-list')
    ).toContainText(ClarasOnboarding.title!);
  });

  test('contains menu to start a journey', async ({ appUri, page }) => {
    await page.goto(appUri + `/organize/${KPD.id}/people/${ClaraZetkin.id}`);

    await page.locator('data-testid=PersonJourneysCard-addButton').click();
    await Promise.all([
      page.waitForNavigation(),
      page.locator(`text=${MarxistTraining.title}`).click(),
    ]);

    expect(page.url()).toMatch(/journeys\/2\/new/);
    expect(page.url()).toMatch(/\?subject=1$/);
  });

  test('is not visible if the organization does not have any journeys.', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/journeys`, 'get', []);

    await page.goto(appUri + `/organize/${KPD.id}/people/${ClaraZetkin.id}`);

    await expect(page.locator('main >> text=Journeys')).not.toBeVisible();
    await expect(
      page.locator('data-testid=PersonJourneysCard-addButton')
    ).not.toBeVisible();
  });
});
