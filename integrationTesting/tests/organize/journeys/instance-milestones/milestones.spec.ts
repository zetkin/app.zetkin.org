import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import { AttendMeeting } from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinJourneyMilestoneStatus } from '../../../../../src/utils/types/zetkin';

test.describe('Journey instance page Milestones tab', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('displays milestones.', async ({ appUri, moxy, page }) => {
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

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    const journeyMilestoneCards = await page.$$eval(
      'data-testid=JourneyMilestoneCard',
      (items) => items.length
    );

    expect(journeyMilestoneCards).toEqual(3);
  });

  test('displays message if there are no milestones.', async ({
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
      { ...ClarasOnboarding, milestones: null }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    expect(
      await page
        .locator('data-testid=JourneyMilestoneCard-noMilestones')
        .textContent()
    ).toBe('There are no milestones.');
  });

  test('lets user update milestone deadline.', async ({
    appUri,
    moxy,
    page,
    setBrowserDate,
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

    await setBrowserDate(new Date(2022, 2, 20));

    const newDeadline = '2022-06-24';
    const { log: patchReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`,
      'patch',
      { ...AttendMeeting, deadline: newDeadline }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    //Click datepicker in first JourneyMilestoneCard
    await page
      .locator(
        '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-datePicker]'
      )
      .first()
      .click();
    //Click June 23
    await page.locator('p:has-text("24")').click();

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click OK to trigger set of new deadline
      page.locator('text=OK').click(),
    ]);

    //Expect the deadline to be the newly set deadline
    expect(
      patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data?.deadline
    ).toMatch(newDeadline);
  });

  test('lets user remove a deadline.', async ({ appUri, moxy, page }) => {
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

    const { log: patchReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`,
      'patch',
      { ...AttendMeeting, deadline: null }
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    //Click datepicker in first JourneyMilestoneCard
    await page
      .locator(
        '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-datePicker]'
      )
      .first()
      .click();

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click "clear"-button
      page.locator('text=clear').click(),
    ]);

    //Expect deadline to be set to null
    expect(patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data?.deadline).toBe(
      null
    );
  });

  test('lets user mark a milestone as completed.', async ({
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

    const { log: patchReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`,
      'patch',
      AttendMeeting
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click "completed"-checkbox in first JourneyMilestoneCard
      await page
        .locator(
          '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-completed]'
        )
        .first()
        .click(),
    ]);

    const submittedDate = new Date(
      patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data!.completed!
    );
    const nowDate = new Date();

    // Check that submitted time is within 10 seconds of now
    expect(Math.abs(submittedDate.getTime() - nowDate.getTime())).toBeLessThan(
      10000
    );
  });

  test('lets user mark a completed milestone as not completed.', async ({
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
      {
        ...ClarasOnboarding,
        milestones: [{ ...AttendMeeting, completed: '2022-04-07' }],
      }
    );

    const { log: patchReqLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`,
      'patch',
      AttendMeeting
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click "completed"-checkbox in JourneyMilestoneCard
      await page
        .locator(
          '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-completed]'
        )
        .click(),
    ]);

    expect(patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data?.completed).toBe(
      null
    );
  });

  test('shows error snackbar if error making request', async ({
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

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`,
      'patch',
      undefined,
      401
    );

    await page.goto(appUri + '/organize/1/journeys/1/1/milestones');

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      await page
        .locator(
          '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-completed]'
        )
        .first()
        .click(),
    ]);

    // Show error
    const snackbar = page.locator('data-testid=Snackbar-error');
    await snackbar.waitFor();

    expect(await snackbar.count()).toEqual(1);
  });
});
