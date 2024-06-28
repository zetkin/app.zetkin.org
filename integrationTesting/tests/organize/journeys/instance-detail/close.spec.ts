import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import PlaysGuitarTag from '../../../../mockData/orgs/KPD/tags/PlaysGuitar';

test.describe('Journey instance detail page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
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
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('can close a journey instance by clicking the close button and filling out the outcome form', async ({
    appUri,
    moxy,
    page,
  }) => {
    const instanceCloseMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'patch',
      {
        ...ClarasOnboarding,
        closed: null,
        tags: [...ClarasOnboarding.tags, CodingSkillsTag],
      }
    );

    const tagPutMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`,
      'put'
    );

    const outcomeNote =
      'The member has accepted the immortal science of Marxist Leninism';

    await page.goto(appUri + '/organize/1/journeys/1/1');

    // Click close instance button
    await page.locator('data-testid=JourneyInstanceCloseButton').click();

    // Add outcome
    await page.fill(
      'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=JourneyInstanceCloseButton-outcomeNoteField',
      outcomeNote
    );

    // Add tags
    await page
      .locator(
        'data-testid=JourneyInstanceCloseButton-outcomeDialog >> text=Add tag'
      )
      .click();
    await page.click(`text=${CodingSkillsTag.title}`);

    // Submit close
    const submitButton = page.locator(
      'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=SubmitCancelButtons-submitButton'
    );

    await Promise.all([
      page.waitForResponse((res) => res.request().method() === 'POST'),
      (async () => {
        await submitButton.click({ force: true }); // To close the tag select popover
        await submitButton.click();
      })(),
    ]);

    // Check requests to tags made
    expect(tagPutMock.log().length).toEqual(1);

    // Check patch request has correct data
    expect(instanceCloseMock.log().length).toEqual(1);
  });
});
