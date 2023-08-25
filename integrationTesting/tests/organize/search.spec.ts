import { expect } from '@playwright/test';
import test from '../../fixtures/next';

import KPD from '../../mockData/orgs/KPD';
import ReferendumSignatures from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import RosaLuxemburg from '../../mockData/orgs/KPD/people/RosaLuxemburg';
import SpeakToFriendAboutReferendum from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';
import ClarasOnboarding from '../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';

test.describe('Search', async () => {
  test.beforeEach(async ({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/campaigns/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/call_assignments', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/surveys', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/search/view', 'post', []);
    moxy.setZetkinApiMock('/orgs/1/search/callassignment', 'post', []);
    moxy.setZetkinApiMock('/orgs/1/search/survey', 'post', []);
    login();
  });

  test('opens the search dialog when entering "/" hotkey', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [RosaLuxemburg]);
    moxy.setZetkinApiMock('/orgs/1/search/campaign', 'post', [
      ReferendumSignatures,
    ]);
    moxy.setZetkinApiMock('/orgs/1/search/task', 'post', [
      SpeakToFriendAboutReferendum,
    ]);

    await page.goto(appUri + '/organize/1/projects/1');
    await page.keyboard.press('/');

    // Check dialog open
    expect(
      await page.locator('#SearchDialog-inputField').isVisible()
    ).toBeTruthy();
  });

  test('shows error indicator if error fetching results', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [], 400);
    moxy.setZetkinApiMock('/orgs/1/search/campaign', 'post', [
      ReferendumSignatures,
    ]);
    moxy.setZetkinApiMock('/orgs/1/search/task', 'post', [
      SpeakToFriendAboutReferendum,
    ]);

    await page.goto(appUri + '/organize/1/projects/1');

    // Open dialog
    await page.click('data-testid=SearchDialog-activator');

    // Type some characters
    await page.fill('#SearchDialog-inputField', 'some input');

    // Wait for debounce
    await page.waitForTimeout(1000);

    // Check that error
    expect(
      await page.locator(`data-testid=SearchDialog-errorIndicator`).isVisible()
    ).toBeTruthy();
  });

  test('shows results when user enters text', async ({
    page,
    moxy,
    appUri,
  }) => {
    const personSearchReq = moxy.setZetkinApiMock(
      '/orgs/1/search/person',
      'post',
      [RosaLuxemburg]
    );
    const campaignSearchReq = moxy.setZetkinApiMock(
      '/orgs/1/search/campaign',
      'post',
      [ReferendumSignatures]
    );
    const taskSearchReq = moxy.setZetkinApiMock('/orgs/1/search/task', 'post', [
      SpeakToFriendAboutReferendum,
    ]);
    const journeyInstanceSearchReq = moxy.setZetkinApiMock(
      '/orgs/1/search/journeyinstance',
      'post',
      [ClarasOnboarding]
    );

    await page.goto(appUri + '/organize/1/projects/1');

    // Open modal
    await page.click('data-testid=SearchDialog-activator');

    // Type some characters
    await page.fill('#SearchDialog-inputField', 'some input');

    // Wait for debounce
    await page.waitForTimeout(1000);

    // Check that requests were made
    expect(personSearchReq.log()[0].mocked).toEqual(true);
    expect(campaignSearchReq.log()[0].mocked).toEqual(true);
    expect(taskSearchReq.log()[0].mocked).toEqual(true);
    expect(journeyInstanceSearchReq.log()[0].mocked).toEqual(true);

    // Check that results list contains all results
    expect(
      await page.locator('data-testid=SearchDialog-resultsListItem').count()
    ).toEqual(4);
  });
});
