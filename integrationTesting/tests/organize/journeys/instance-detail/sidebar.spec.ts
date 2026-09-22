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

    const assignees = page.locator(
      `[data-testid=ZetkinSection-assignees] [data-testid=JourneyPerson-${ClarasOnboarding.assignees[0].id}]`
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');
    await assignees.first().waitFor({ state: 'visible' });

    const numAssignees = await assignees.count();
    expect(numAssignees).toEqual(1);
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

    //click Angela in search results
    await page
      .locator(
        `text=${ClarasOnboarding.assignees[0].first_name} ${ClarasOnboarding.assignees[0].last_name}`
      )
      .click();

    //Expect PUT-request to be done
    await expect.poll(() => putTagLog().length).toBe(1);

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
    const { log: deleteLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/assignees/${ClarasOnboarding.assignees[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    // Hover over Angela
    await page
      .locator(`data-testid=JourneyPerson-${ClarasOnboarding.assignees[0].id}`)
      .hover();

    // Set up parallel tracks: update mock and click delete
    await Promise.all([
      (async () => {
        await page.waitForRequest((req) => req.method() == 'DELETE');
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
          'get',
          { ...ClarasOnboarding, assignees: [] }
        );
        await page.waitForResponse(
          `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
        );
      })(),
      (async () => {
        await page
          .locator(
            `data-testid=JourneyPerson-remove-${ClarasOnboarding.assignees[0].id}`
          )
          .click();
      })(),
    ]);

    await expect.poll(() => deleteLog().length).toBe(1);

    // Wait for React to re-render
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

    const subjects = page.locator(
      `[data-testid=ZetkinSection-subjects] [data-testid=JourneyPerson-${ClarasOnboarding.subjects[0].id}]`
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');
    await subjects.first().waitFor({ state: 'visible' });

    const numSubjects = await subjects.count();
    expect(numSubjects).toEqual(1);
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

    //click Clara in search results
    await page
      .locator(
        `text=${ClarasOnboarding.subjects[0].first_name} ${ClarasOnboarding.subjects[0].last_name}`
      )
      .click();

    //Expect PUT-request to be done
    await expect.poll(() => putTagLog().length).toBe(1);

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
    //DELETE Clara from list of subjects
    const { log: deleteLog } = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/subjects/${ClarasOnboarding.subjects[0].id}`,
      'delete'
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    // Hover over Clara
    await page
      .locator(
        `[data-testid=ZetkinSection-subjects] [data-testid=JourneyPerson-${ClarasOnboarding.subjects[0].id}]`
      )
      .hover();

    // Set up parallel tracks: update mock and click delete
    await Promise.all([
      (async () => {
        await page.waitForRequest((req) => req.method() == 'DELETE');
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
          'get',
          { ...ClarasOnboarding, subjects: [] }
        );
        await page.waitForResponse(
          `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
        );
      })(),
      (async () => {
        await page
          .locator(
            `data-testid=JourneyPerson-remove-${ClarasOnboarding.subjects[0].id}`
          )
          .click();
      })(),
    ]);

    await expect.poll(() => deleteLog().length).toBe(1);

    // Wait for React to re-render
    await page.waitForTimeout(200);

    //there should be no Clara in list of subjects
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

    await page.goto(appUri + '/organize/1/journeys/1/1');

    await expect(page.locator(`text="${ActivistTag.title}"`)).toBeVisible();
    await expect(page.locator(`text="${PlaysGuitarTag.title}"`)).toBeVisible();
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

    await page.goto(appUri + '/organize/1/journeys/1/1');

    await page.locator('text=Add tag').click();

    await page.click(`text=${CodingSkillsTag.title}`);

    // Expect to have made request to put tag
    await expect.poll(() => putTagLog().length).toBe(1);
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

    await page.goto(appUri + '/organize/1/journeys/1/1');

    await page.locator(`text="${ActivistTag.title}"`).hover();
    await page.locator(`[data-testid=TagChip-deleteButton]`).first().click();

    // Expect to have made request to delete tag
    await expect.poll(() => deleteTagLog().length).toBe(1);
  });
});
