import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MarxistTraining from '../../../../mockData/orgs/KPD/journeys/MarxistTraining';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinJourneyInstance } from '../../../../../src/types/zetkin';

test.describe('Changing the type of a journey instance', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('updates the id of the journey in the instance.', async ({
    appUri,
    moxy,
    page,
  }) => {
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

    moxy.setZetkinApiMock(`/orgs/${KPD.id}/journeys`, 'get', [
      MarxistTraining,
      MemberOnboarding,
    ]);

    const { log: patchReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'patch',
      {
        journey: {
          id: MarxistTraining.id,
          title: MarxistTraining.singular_label,
        },
      }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Click ellipsis menu
    await page.locator('data-testid=EllipsisMenu-menuActivator').click();

    //Click "Convert to..."
    await page.locator('text=Convert to...').click();

    //Click type of journey to convert to, "Marxist Training"
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
      ),
      page.locator('text=Marxist Training').click(),
    ]);

    //Expect the id to be the MarxistJourney id.
    expect(patchReqLog<ZetkinJourneyInstance>()[0].data?.journey.id).toBe(
      MarxistTraining.id
    );
  });

  test('shows error snackbar if request is wrong', async ({
    appUri,
    moxy,
    page,
  }) => {
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

    moxy.setZetkinApiMock(`/orgs/${KPD.id}/journeys`, 'get', [
      MarxistTraining,
      MemberOnboarding,
    ]);

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'patch',
      undefined
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Click ellipsis menu
    await page.locator('data-testid=EllipsisMenu-menuActivator').click();

    //Click "Convert to..."
    await page.locator('text=Convert to...').click();

    //Click type of journey to convert to, "Marxist Training"
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
      ),
      page.locator('text=Marxist Training').click(),
    ]);

    expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
  });

  test('successful conversion redirects to journey instance page.', async ({
    appUri,
    moxy,
    page,
  }) => {
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

    moxy.setZetkinApiMock(`/orgs/${KPD.id}/journeys`, 'get', [
      MarxistTraining,
      MemberOnboarding,
    ]);

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'patch',
      {
        journey: {
          id: MarxistTraining.id,
          title: MarxistTraining.singular_label,
        },
      }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Click ellipsis menu
    await page.locator('data-testid=EllipsisMenu-menuActivator').click();

    //Click "Convert to..."
    await page.locator('text=Convert to...').click();

    //Click type of journey to convert to, "Marxist Training", and wait for navigation.
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
      ),
      page.locator('text=Marxist Training').click(),
      page.waitForNavigation({
        url: `**/organize/${KPD.id}/journeys/${MarxistTraining.id}/${ClarasOnboarding.id}`,
      }),
    ]);

    expect(page.url()).toEqual(
      appUri +
        `/organize/${KPD.id}/journeys/${MarxistTraining.id}/${ClarasOnboarding.id}`
    );
  });
});
