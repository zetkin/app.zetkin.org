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

    const tagToDelete = page
      .locator('[data-testid=TagManager-groupedTags-ungrouped]')
      .locator('[data-testid=TagChip-value]')
      .filter({ hasText: PlaysGuitarTag.title });
    const chipRoot = tagToDelete.locator('..').locator('..');
    const deleteButton = chipRoot.locator('[data-testid=TagChip-deleteButton]');

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await expect(tagToDelete).toBeVisible();

    await tagToDelete.hover();
    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    await expect.poll(() => deleteTagLog().length).toBeGreaterThan(0);

    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', []);

    await expect(tagToDelete).toHaveCount(0);

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
    const { log: deleteTagLog } = moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}/tags/${PlaysGuitarTag.id}`,
      'delete',
      undefined,
      401
    );

    const tagChip = page
      .locator('[data-testid=TagManager-groupedTags-ungrouped]')
      .locator('[data-testid=TagChip-value]')
      .filter({ hasText: PlaysGuitarTag.title });
    const chipRoot = tagChip.locator('..').locator('..');
    const deleteButton = chipRoot.locator('[data-testid=TagChip-deleteButton]');

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    await expect(tagChip).toBeVisible();

    await tagChip.hover();

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect.poll(() => deleteTagLog().length).toBeGreaterThan(0);

    // Show error
    await expect(page.locator('[data-testid=Snackbar-error]')).toBeVisible();
  });
});
