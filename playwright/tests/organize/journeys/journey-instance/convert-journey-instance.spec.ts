import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MarxistTraining from '../../../../mockData/orgs/KPD/journeys/MarxistTraining';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Changing the type of a journey instance', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('updates the id of the journey in the instance and redirects.', async ({
    appUri,
    moxy,
    page,
  }) => {
    // Set up mocks for journeys (both for before and for after conversion)
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
      'get',
      MemberOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MarxistTraining.id}`,
      'get',
      MarxistTraining
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

    //Mock fetch converted Claras onboarding
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      {
        ...ClarasOnboarding,
        journey: {
          id: MarxistTraining.id,
          title: MarxistTraining.title,
        },
      }
    );

    //Click type of journey to convert to, "Marxist Training"
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
      ),
      page.waitForNavigation({
        url: `**/organize/${KPD.id}/journeys/${MarxistTraining.id}/${ClarasOnboarding.id}`,
      }),
      (async () => {
        await page.locator('data-testid=EllipsisMenu-menuActivator').click();
        await page.locator('text=Convert to...').click();
        await page.locator('text=Marxist training').click();
      })(),
    ]);

    //Expect the id to be the MarxistJourney id.
    expect(patchReqLog<{ journey_id: number }>()[0].data?.journey_id).toBe(
      MarxistTraining.id
    );

    //Expect redirect to journey instance paage with new journey id.
    expect(page.url()).toEqual(
      appUri +
        `/organize/${KPD.id}/journeys/${MarxistTraining.id}/${ClarasOnboarding.id}`
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

    //Click type of journey to convert to, "Marxist Training"
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
      ),
      (async () => {
        await page.locator('data-testid=EllipsisMenu-menuActivator').click();
        await page.locator('text=Convert to...').click();
        await page.locator('text=Marxist training').click();
      })(),
    ]);

    expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
  });

  test('redirects to url with correct journey id if wrong one is supplied.', async ({
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

    await page.goto(
      appUri +
        `/organize/${KPD.id}/journeys/${MarxistTraining.id}/${ClarasOnboarding.id}`
    );

    expect(page.url()).toEqual(
      appUri +
        `/organize/${KPD.id}/journeys/${ClarasOnboarding.id}/${ClarasOnboarding.id}`
    );
  });
});
