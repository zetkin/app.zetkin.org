import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';

test.describe('Journey instance detail page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('lets user edit summary', async ({ appUri, moxy, page }) => {
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

    const newSummaryText = 'This is the new summary text. Wow!';

    const { log: patchJourneyReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'patch',
      { ...ClarasOnboarding, summary: newSummaryText }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    await page.click('data-testid=JourneyInstanceSummary-editButton');

    await page.fill(
      'data-testid=JourneyInstanceSummary-textArea',
      newSummaryText
    );

    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'PATCH'),
      page.click('data-testid=SubmitCancelButtons-submitButton'),
    ]);

    // Makes request with correct data
    expect(
      patchJourneyReqLog<ZetkinJourneyInstance>()[0].data?.summary
    ).toEqual(newSummaryText);
  });
});
