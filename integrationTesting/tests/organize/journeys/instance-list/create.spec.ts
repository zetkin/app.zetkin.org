import { expect } from '@playwright/test';

import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import MarxistTraining from '../../../../mockData/orgs/KPD/journeys/MarxistTraining';
import test from '../../../../fixtures/next';
import { ZetkinJourneyInstance } from '../../../../../src/utils/types/zetkin';

test.describe('Creating a journey instance from journey instance page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/journeys/2', 'get', MarxistTraining);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows new page with correct labels', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock('/orgs/1/journeys/2/instances', 'get', []);

    await page.goto(appUri + '/organize/1/journeys/2');

    await Promise.all([
      page.waitForNavigation(),
      page.locator('data-testid=JourneyInstanceOverviewPage-addFab').click(),
    ]);

    expect(
      await page
        .locator('data-testid=SubmitCancelButtons-submitButton')
        .textContent()
    ).toEqual('Create new Marxist training');

    expect(await page.locator('data-testid=page-title').textContent()).toEqual(
      'New Marxist training'
    );
  });

  test('creates instance without subjects, assignees, or tags', async ({
    appUri,
    moxy,
    page,
  }) => {
    const instMock = moxy.setZetkinApiMock(
      '/orgs/1/journeys/2/instances',
      'post',
      { id: 1857 } as ZetkinJourneyInstance
    );

    await page.goto(appUri + '/organize/1/journeys/2/new');
    await page.locator('[data-testid=page-title] input').type('My training');
    await page.locator('[data-testid=page-title] input').press('Enter');
    await page.locator('data-testid=AutoTextArea-textarea').type('Some info');

    await Promise.all([
      page.waitForResponse((res) => res.url().includes('api')),
      page.locator('data-testid=SubmitCancelButtons-submitButton').click(),
    ]);

    const requests = instMock.log<ZetkinJourneyInstance>();
    expect(requests.length).toBe(1);
    expect(requests[0].data?.title).toEqual('My training');
    expect(requests[0].data?.opening_note).toEqual('Some info');
  });

  test('creates instance with subjects, assignees, and tags', async ({
    appUri,
    moxy,
    page,
  }) => {
    const instMock = moxy.setZetkinApiMock(
      '/orgs/1/journeys/2/instances',
      'post',
      {
        id: 1857,
      } as ZetkinJourneyInstance
    );

    // Mock search for Angela
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/search/person`, 'post', [
      ClaraZetkin,
    ]);
    // Mock adding Angela as an assignee
    const assigneeMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/1857/assignees/${ClaraZetkin.id}`,
      'put'
    );
    // Mock adding Angela as a subject
    const subjectMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/1857/subjects/${ClaraZetkin.id}`,
      'put'
    );
    // Mock loading Angela's data
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin.id
    );
    // Mock loading available tags and groups
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
    // Mock assigning tag to instance
    const tagMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/1857/tags/${ActivistTag.id}`,
      'put'
    );

    await page.goto(appUri + '/organize/1/journeys/2/new');
    await page.locator('data-testid=AutoTextArea-textarea').type('Some info');

    // Add a subject
    await page.locator('data-testid=Button-add-subject').click();
    await page.locator(':has-text("Add person") > input').type('Clara');
    await page
      .locator('.MuiAutocomplete-popper li:has-text("Clara Zetkin")')
      .click();

    // Add an assignee
    await page.locator('data-testid=Button-add-assignee').click();
    await page.locator(':has-text("Assign person") > input').type('Clara');
    await page
      .locator('.MuiAutocomplete-popper li:has-text("Clara Zetkin")')
      .click();

    // Assign a tag
    await page.locator('text=Add tag').click();
    await page.click('text=Activist');
    // Click outside of tags manager to close it
    await page
      .locator('data-testid=SubmitCancelButtons-submitButton')
      .click({ force: true });

    await Promise.all([
      page.waitForResponse(async (res) => res.url().includes('createNew')),
      page.locator('data-testid=SubmitCancelButtons-submitButton').click(),
    ]);

    // Expect requests to have been made to:
    // * POST to create journey instance
    // * PUT to add assignee
    // * PUT to add subject
    // * PUT to assign tag
    expect(instMock.log().length).toBe(1);
    expect(assigneeMock.log().length).toBe(1);
    expect(subjectMock.log().length).toBe(1);
    expect(tagMock.log().length).toBe(1);
  });
});
