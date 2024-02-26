import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';

test.describe('Tags manager', () => {
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

  test.only('lets user remove a tag', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      [ActivistTag]
    );
    const { log: deleteTagLog } = moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'delete'
    );

    const tagToDelete = page.locator(`text="${ActivistTag.title}"`);
    const deleteButton = page.locator('[data-testid=TagChip-deleteButton]');

    await Promise.all([
      page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`),
      tagToDelete.waitFor({ state: 'visible' }),
    ]);

    await Promise.all([
      tagToDelete.hover(),
      deleteButton.waitFor({ state: 'visible' }),
    ]);

    await Promise.all([
      page.waitForRequest((req) => req.method() == 'DELETE'),
      deleteButton.click(),
    ]);

    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', []);

    await tagToDelete.nth(2).waitFor({ state: 'hidden' });

    // Expect to have made request to delete tag
    expect(deleteTagLog().length).toEqual(1);
  });

  test('shows error snackbar when removing a tag fails', async ({
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
      [ActivistTag]
    );
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'delete',
      undefined,
      401
    );

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await page.locator(`text="${ActivistTag.title}"`).hover();
    await page.locator('[data-testid=TagChip-deleteButton]').click();

    // Show error
    await page.locator('data-testid=Snackbar-error').waitFor();
  });
});
