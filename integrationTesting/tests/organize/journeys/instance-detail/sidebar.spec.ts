import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import PlaysGuitarTag from '../../../../mockData/orgs/KPD/tags/PlaysGuitar';

test.describe('Journey instance detail page sidebar', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows a list of assigned people', async ({ appUri, moxy, page }) => {
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

    await page.goto(appUri + '/organize/1/journeys/1/1');

    expect(
      await page
        .locator(
          `[data-testid=ZetkinSection-assignees] [data-testid=JourneyPerson-${ClarasOnboarding.assignees[0].id}]`
        )
        .count()
    ).toEqual(1);
  });

  test('lets user assign new person to the journey instance', async ({
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
      { ...ClarasOnboarding, assignees: [] }
    );
    //Angela appears in search results in PersonSelect
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/search/person`, 'post', [
      ClarasOnboarding.assignees[0],
    ]);
    //Add Angela as assignee
    const { log: putTagLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/assignees/${ClarasOnboarding.assignees[0].id}`,
      'put'
    );
    //GET data for Angela to render her info
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClarasOnboarding.assignees[0].id}`,
      'get',
      ClarasOnboarding.assignees[0]
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Open PersonSelect and search for Angela
    await page.locator('data-testid=Button-add-assignee').click();
    await page.locator(':has-text("Assign person") > input').type('Angela');

    //GET the journeyInstance with Angela as assignee
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    //click Angela in search results and wait for response
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/assignees/${ClarasOnboarding.assignees[0].id}`
      ),
      page
        .locator(
          `text=${ClarasOnboarding.assignees[0].first_name} ${ClarasOnboarding.assignees[0].last_name}`
        )
        .click(),
    ]);

    //Expect PUT-request to be done
    expect(putTagLog().length).toEqual(1);

    //Expect Add assignee-button to be visible
    expect(
      await page.locator(`data-testid=Button-add-assignee`).isVisible()
    ).toBeTruthy();
  });

  test('lets user remove assigned person from the journey instance', async ({
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
    //DELETE Angela from list of assignees
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/assignees/${ClarasOnboarding.assignees[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    // Set up two parallel async tracks
    await Promise.all([
      // Track A waits for HTTP requests and updates mocks to reflect that
      // an assignee has been deleted
      (async () => {
        await page.waitForRequest((res) => res.method() == 'DELETE');

        // Update journey instance mock with no assignees
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
          'get',
          { ...ClarasOnboarding, assignees: [] }
        );

        await page.waitForResponse(
          (res) =>
            res.request().method() === 'GET' &&
            res
              .request()
              .url()
              .endsWith(`/journey_instances/${ClarasOnboarding.id}`)
        );
      })(),

      // Track B performs UI interactions in parallel with track A
      (async () => {
        // Hover over Angela
        await page
          .locator(
            `data-testid=JourneyPerson-${ClarasOnboarding.assignees[0].id}`
          )
          .hover();

        // Click X icon
        await page
          .locator(
            `data-testid=JourneyPerson-remove-${ClarasOnboarding.assignees[0].id}`
          )
          .click();
      })(),
    ]);

    // Wait a short while for React to re-render after data has been retrieved
    await page.waitForTimeout(200);

    //there should be no Angela in list of assignees
    expect(
      await page
        .locator(
          `[data-testid=ZetkinSection-assignees] [data-testid=JourneyPerson-${ClarasOnboarding.assignees[0].id}]`
        )
        .isVisible()
    ).toBeFalsy();
  });

  test('shows a list of subjects.', async ({ appUri, moxy, page }) => {
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

    await page.goto(appUri + '/organize/1/journeys/1/1');

    expect(
      await page
        .locator(
          `[data-testid=ZetkinSection-subjects] [data-testid=JourneyPerson-${ClarasOnboarding.subjects[0].id}]`
        )
        .count()
    ).toEqual(1);
  });

  //put request works
  test('lets user add new subject to the journey instance.', async ({
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
      { ...ClarasOnboarding, subjects: [] }
    );
    //Clara appears in search results in PersonSelect
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/search/person`, 'post', [
      ClarasOnboarding.subjects[0],
    ]);
    //Add Clara as subject
    const { log: putTagLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/subjects/${ClarasOnboarding.subjects[0].id}`,
      'put'
    );
    //GET data for Clara to render her info
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClarasOnboarding.subjects[0].id}`,
      'get',
      ClarasOnboarding.subjects[0]
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    //Open PersonSelect and search for Clara
    await page.locator('data-testid=Button-add-subject').click();
    await page.locator(':has-text("Add person") > input').type('Clara');

    //GET the journeyInstance with Clara as assignee
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    //click Clara in search results and awit for response
    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/subjects/${ClarasOnboarding.subjects[0].id}`
      ),
      page
        .locator(
          `text=${ClarasOnboarding.subjects[0].first_name} ${ClarasOnboarding.subjects[0].last_name}`
        )
        .click(),
    ]);

    //Expect PUT-request to be done
    expect(putTagLog().length).toEqual(1);

    //Expect Add subject-button to be visible
    expect(
      await page.locator(`data-testid=Button-add-subject`).isVisible()
    ).toBeTruthy();
  });

  //delete request works
  test('lets user remove a member from the journey instance.', async ({
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
    //DELETE Angela from list of assignees
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/subjects/${ClarasOnboarding.subjects[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    // Set up two parallel async tracks
    await Promise.all([
      (async () => {
        await page.waitForRequest((req) => req.method() == 'DELETE');

        // Update journey instance mocke, with no subjects
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
          'get',
          { ...ClarasOnboarding, subjects: [] }
        );

        await page.waitForResponse(
          (res) =>
            res.request().method() === 'GET' &&
            res
              .request()
              .url()
              .endsWith(`/journey_instances/${ClarasOnboarding.id}`)
        );
      })(),

      (async () => {
        // Hover over Clara
        await page
          .locator(
            `[data-testid=ZetkinSection-subjects] [data-testid=JourneyPerson-${ClarasOnboarding.subjects[0].id}]`
          )
          .hover();

        // Click X icon
        await page
          .locator(
            `data-testid=JourneyPerson-remove-${ClarasOnboarding.subjects[0].id}`
          )
          .click();
      })(),
    ]);

    // Wait for React to re-render after response
    await page.waitForTimeout(200);

    //there should be no Clara in list of subejcts
    expect(
      await page
        .locator(
          `[data-testid=ZetkinSection-subjects] [data-testid=JourneyPerson-${ClarasOnboarding.subjects[0].id}]`
        )
        .isVisible()
    ).toBeFalsy();
  });

  test('shows assigned tags', async ({ appUri, page, moxy }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${ClarasOnboarding.id}`,
      'get',
      MemberOnboarding
    );

    await Promise.all([
      page.waitForResponse(`**/orgs/${KPD.id}/people/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/tag_groups`),
      await page.goto(appUri + '/organize/1/journeys/1/1'),
    ]);

    expect(
      await page.locator(`text="${ActivistTag.title}"`).isVisible()
    ).toBeTruthy();
    expect(
      await page.locator(`text="${PlaysGuitarTag.title}"`).isVisible()
    ).toBeTruthy();
  });
  test('let user assign a tag to the journey instance', async ({
    appUri,
    page,
    moxy,
  }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${ClarasOnboarding.id}`,
      'get',
      MemberOnboarding
    );

    const { log: putTagLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`,
      'put'
    );

    await Promise.all([
      page.waitForResponse(`**/orgs/${KPD.id}/people/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/tag_groups`),
      page.goto(appUri + '/organize/1/journeys/1/1'),
    ]);

    await page.locator('text=Add tag').click();

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`
      ),
      page.click(`text=${CodingSkillsTag.title}`),
    ]);

    // Expect to have made request to put tag
    expect(putTagLog().length).toEqual(1);
  });
  test('lets user unassign a tag from the journey instance', async ({
    appUri,
    page,
    moxy,
  }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${ClarasOnboarding.id}`,
      'get',
      MemberOnboarding
    );

    const { log: deleteTagLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${ActivistTag.id}`,
      'delete'
    );

    await Promise.all([
      page.waitForResponse(`**/orgs/${KPD.id}/people/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/tag_groups`),
      page.goto(appUri + '/organize/1/journeys/1/1'),
    ]);

    await page.locator(`text="${ActivistTag.title}"`).hover();

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${ActivistTag.id}`
      ),
      page.locator(`[data-testid=TagChip-deleteButton]`).first().click(),
    ]);

    // Expect to have made request to delete tag
    expect(deleteTagLog().length).toEqual(1);
  });
});
