import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MarxistTraining from '../../../../mockData/orgs/KPD/journeys/MarxistTraining';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Journey instance detail page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('lets user edit the type of a journey instance.', async ({
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
        ...ClarasOnboarding,
        journey: {
          id: MarxistTraining.id,
          plural_label: MarxistTraining.plural_label,
          singular_label: MarxistTraining.singular_label,
          title: MarxistTraining.title,
        },
      }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Click ellipsis menu
    await page
      .locator('header [data-testid=ZUIEllipsisMenu-menuActivator]')
      .click();

    //Click "Convert to..."
    await page.locator('text=Convert to...').click();

    //Mock fetch converted Claras onboarding
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      {
        ...ClarasOnboarding,
        journey: {
          id: MarxistTraining.id,
          plural_label: MarxistTraining.plural_label,
          singular_label: MarxistTraining.singular_label,
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
      page.locator('text=Marxist training').click(),
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
