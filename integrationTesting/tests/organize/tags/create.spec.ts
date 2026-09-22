import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';
import SkillsGroup from '../../../mockData/orgs/KPD/tags/groups/Skills';

test.describe('Tag manager', () => {
  test.beforeEach(async ({ page, appUri, moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
    ]);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      []
    );

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user create a tag', async ({ page, moxy }) => {
    const createTagRequest = moxy.setZetkinApiMock(
      '/orgs/1/people/tags',
      'post',
      ActivistTag
    );
    const assignNewTagRequest = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'put',
      {}
    );

    await page.locator('text=Add tag').click();
    await page.click('data-testid=TagManager-TagSelect-createTagOption');
    await page.fill(
      'data-testid=TagManager-TagDialog-titleField',
      ActivistTag.title
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      [ActivistTag, CodingSkillsTag, ActivistTag]
    );

    await page.click('data-testid=SubmitCancelButtons-submitButton');

    await expect.poll(() => createTagRequest.log().length).toBe(1);
    await expect.poll(() => assignNewTagRequest.log().length).toBe(1);
  });

  test('lets user create a tag group and tag with that group', async ({
    page,
    moxy,
  }) => {
    const createTagRequest = moxy.setZetkinApiMock(
      '/orgs/1/people/tags',
      'post',
      ActivistTag
    );
    const createTagGroupRequest = moxy.setZetkinApiMock(
      '/orgs/1/tag_groups',
      'post',
      SkillsGroup
    );
    const assignNewTagRequest = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
      'put',
      {}
    );

    await page.locator('text=Add tag').click();
    await page.click('data-testid=TagManager-TagSelect-createTagOption');
    await page.fill(
      'data-testid=TagManager-TagDialog-titleField',
      ActivistTag.title
    );
    // Create group
    await page.fill(
      'data-testid=TagManager-TagDialog-tagGroupSelect',
      SkillsGroup.title
    );
    await page.click(`text=Add "${SkillsGroup.title}"`);

    await page.click('data-testid=SubmitCancelButtons-submitButton');

    await expect.poll(() => createTagGroupRequest.log().length).toBe(1);
    await expect.poll(() => createTagRequest.log().length).toBe(1);
    await expect.poll(() => assignNewTagRequest.log().length).toBe(1);
  });
});
