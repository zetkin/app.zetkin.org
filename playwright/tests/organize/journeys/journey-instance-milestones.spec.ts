import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import { AttendMeeting } from '../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import ClarasOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinJourneyMilestoneStatus } from '../../../../src/types/zetkin';

test.describe('Journey instance Milestones tab', () => {
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
        .locator('data-testid=JourneyMilestoneCard-noMilestonesMessage')
        .textContent()
    ).toBe('There are no milestones.');
  });

  test.describe('JourneyMilestoneCard', () => {
    test('lets you update milestone deadline.', async ({
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

      const newDeadline = '2022-06-23';
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
      //Click June 23 to trigger set of new deadline
      await page.locator('p:has-text("23")').click();

      await Promise.all([
        page.waitForResponse(
          `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/milestones/${AttendMeeting.id}`
        ),
        //Click June 23 to trigger set of new deadline
        page.locator('text=OK').click(),
      ]);

      //Expect the deadline to be the newly set deadline
      expect(
        patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data?.deadline
      ).toMatch(newDeadline);
    });

    test('lets you remove a deadline.', async ({ appUri, moxy, page }) => {
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
      expect(
        patchReqLog<ZetkinJourneyMilestoneStatus>()[0].data?.deadline
      ).toBe(null);
    });
  });
});
