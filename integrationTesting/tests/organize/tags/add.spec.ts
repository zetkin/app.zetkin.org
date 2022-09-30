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

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await page.locator('text=Add tag').click();

    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
      ActivistTag,
    ]);

    // Select tag
    await page.click('text=Activist');

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
    expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
  });
});
