import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';
import PlaysGuitarTag from '../../../mockData/orgs/KPD/tags/PlaysGuitar';

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

  test('lets user remove a tag', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      PlaysGuitarTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      [PlaysGuitarTag]
    );
    const { log: deleteTagLog } = moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${PlaysGuitarTag.id}`,
      'delete'
    );

    const tagToDelete = page.locator(
      `data-testid=TagManager-groupedTags-ungrouped >> text="${PlaysGuitarTag.title}"`
    );
    const deleteButton = page.locator('[data-testid=TagChip-deleteButton]');

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);
    await tagToDelete.waitFor({ state: 'visible' });

    await tagToDelete.hover();
    await deleteButton.waitFor({ state: 'visible' });

    await Promise.all([
      page.waitForRequest((req) => req.method() == 'DELETE'),
      deleteButton.click(),
    ]);

    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', []);

    await tagToDelete.waitFor({ state: 'hidden' });

    // Expect to have made request to delete tag
    expect(deleteTagLog().length).toEqual(1);
  });

  test('shows error snackbar when removing a tag fails', async ({
    moxy,
    page,
    appUri,
  }) => {
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      PlaysGuitarTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      [PlaysGuitarTag]
    );
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${PlaysGuitarTag.id}`,
      'delete',
      undefined,
      401
    );

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await page.locator(`text="${PlaysGuitarTag.title}"`).hover();
    await page.locator('[data-testid=TagChip-deleteButton]').click();

    // Show error
    await page.locator('data-testid=Snackbar-error').waitFor();
  });
});
