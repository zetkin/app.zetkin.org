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

    const journeyMilestoneCards = page.locator(
      'data-testid=JourneyMilestoneCard'
    );
    await Promise.all([
      page.goto(appUri + '/organize/1/journeys/1/1/milestones'),
      journeyMilestoneCards.first().waitFor({ state: 'visible' }),
    ]);

    const numCards = await journeyMilestoneCards.count();
    expect(numCards).toEqual(3);
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

    const datePicker = page.locator(
      '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-datePicker] button[aria-label*="Choose"]'
    );
    const june24 = page.locator('button:has-text("24")');

    await Promise.all([
      page.goto(appUri + '/organize/1/journeys/1/1/milestones'),
      datePicker.first().waitFor({ state: 'visible' }),
    ]);

    //Click datepicker in first JourneyMilestoneCard
    await Promise.all([
      datePicker.first().click(),
      june24.waitFor({ state: 'visible' }),
    ]);

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click June 24 to trigger setting new deadline
      await june24.click(),
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

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
      ),
      //Click "clear"-button
      page
        .locator(
          '[data-testid=JourneyMilestoneCard] [data-testid=JourneyMilestoneCard-datePicker] button[aria-label*="Choose"]'
        )
        .first()
        .click(),
      page
        .locator(
          '[data-testid=JourneyMilestoneCard-datePickerActionBar] button'
        )
        .first()
        .click(),
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
});
