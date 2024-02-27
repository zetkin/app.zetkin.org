import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';
import OccupationTag from '../../../mockData/orgs/KPD/tags/Occupation';

test.describe('Tag manager', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user add tag', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      []
    );

    const { log: putTagLog } = moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'put'
    );

    const addTagButton = page.locator('text=Add tag');
    const activist = page.locator('text=Activist');

    page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);
    addTagButton.first().waitFor({ state: 'visible' });

    await page.locator('text=Add tag').click();

    await activist.first().waitFor({ state: 'visible' });

    // Select tag
    await activist.first().click();

    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
      ActivistTag,
    ]);

    // Wait for the tag to appear on the page
    await activist.nth(1).waitFor({ state: 'visible' });

    // Expect to have made request to put tag
    expect(putTagLog().length).toEqual(1);
  });

  test('lets user add value tag', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
      OccupationTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      []
    );
    const { log: putTagLog } = moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'put'
    );

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await page.locator('text=Add tag').click();

    // Select tag
    await page.click('text=Occupation');

    await page
      .locator('data-testid=TagManager-TagSelect-searchField')
      .type('Revolutionary');

    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'PUT'),
      page.locator('data-testid=SubmitCancelButtons-submitButton').click(),
    ]);

    // Expect to have made request to put tag
    expect(putTagLog()[0].data).toEqual({
      value: 'Revolutionary',
    });
  });

  test('shows error snackbar when adding tag fails', async ({
    moxy,
    page,
    appUri,
  }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      []
    );
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'put',
      undefined,
      401
    );

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await page.locator('text=Add tag').click();

    // Select tag
    await page.click('text=Activist');

    // Show error
    await page.locator('data-testid=Snackbar-error').waitFor();
  });
});
