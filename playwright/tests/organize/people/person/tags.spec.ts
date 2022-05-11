import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import OrganizerTag from '../../../../mockData/orgs/KPD/tags/Organizer';
import PlaysGuitarTag from '../../../../mockData/orgs/KPD/tags/PlaysGuitar';
import SkillsGroup from '../../../../mockData/orgs/KPD/tags/groups/Skills';

test.describe('Person Profile Page Tags', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lists tags', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/people/tags', 'get', [
      ActivistTag,
      CodingSkillsTag,
      OrganizerTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
      OrganizerTag,
      PlaysGuitarTag,
    ]);

    await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

    expect(
      await page.locator(`text="${ActivistTag.title}"`).isVisible()
    ).toBeTruthy();
    expect(
      await page.locator(`text="${OrganizerTag.title}"`).isVisible()
    ).toBeTruthy();
    expect(
      await page.locator(`text="${CodingSkillsTag.title}"`).isVisible()
    ).toBeTruthy();
    expect(
      await page.locator(`text="${PlaysGuitarTag.title}"`).isVisible()
    ).toBeTruthy();
  });
  test.describe('assigning tags', () => {
    test('can add tag to person', async ({ page, appUri, moxy }) => {
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

    test('shows error when adding tag fails', async ({
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
      expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(
        1
      );
    });
  });
  test.describe('unassigning tags', () => {
    test('can remove a tag from person', async ({ page, appUri, moxy }) => {
      moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
        ActivistTag,
        CodingSkillsTag,
      ]);
      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
        'get',
        [ActivistTag, CodingSkillsTag]
      );
      const { log: deleteTagLog } = moxy.setZetkinApiMock(
        `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
        'delete'
      );

      await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

      await page.locator(`text="${ActivistTag.title}"`).hover();
      await page.locator('.MuiChip-deleteIcon').click();

      moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
        CodingSkillsTag,
      ]);

      // Expect to have made request to delete tag
      expect(deleteTagLog().length).toEqual(1);
    });

    test('shows error when removing a tag fails', async ({
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
        [ActivistTag, CodingSkillsTag]
      );
      moxy.setZetkinApiMock(
        `/orgs/1/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`,
        'delete',
        undefined,
        401
      );

      await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

      await page.locator(`text="${ActivistTag.title}"`).hover();
      await page.locator('.MuiChip-deleteIcon').click();

      // Show error
      expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(
        1
      );
    });
  });

  test.describe('creating tags', () => {
    test.beforeEach(async ({ page, appUri, moxy }) => {
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
    test('can create a tag', async ({ page, moxy }) => {
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

      await Promise.all([
        page.waitForResponse('**/orgs/1/people/tags'),
        page.waitForResponse(
          `**/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`
        ),
        page.click('data-testid=submit-button'),
      ]);

      // Check that request made to create tag
      expect(createTagRequest.log().length).toEqual(1);

      // Check that request made to apply tag
      expect(assignNewTagRequest.log().length).toEqual(1);
    });

    test.describe('create a tag with a new group', () => {
      test('can create a group and tag with that group', async ({
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

        await Promise.all([
          page.waitForResponse(`**/orgs/1/tag_groups`),
          page.waitForResponse('**/orgs/1/people/tags'),
          page.waitForResponse(
            `**/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags/${ActivistTag.id}`
          ),
          page.click('data-testid=submit-button'),
        ]);

        // Check that request made to create group
        expect(createTagGroupRequest.log().length).toEqual(1);

        // Check that request made to create tag
        expect(createTagRequest.log().length).toEqual(1);

        // Check that request made to apply tag
        expect(assignNewTagRequest.log().length).toEqual(1);
      });
      test('shows error when creating group fails', async ({ page, moxy }) => {
        moxy.setZetkinApiMock('/orgs/1/tag_groups', 'post', {}, 404);

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

        await page.click('data-testid=submit-button');

        // Show error
        expect(
          await page.locator('data-testid=Snackbar-error').count()
        ).toEqual(1);
      });
    });

    test('shows error when creating a tag fails', async ({ moxy, page }) => {
      moxy.setZetkinApiMock('/orgs/1/people/tags', 'post', {}, 409);

      await page.locator('text=Add tag').click();
      await page.click('data-testid=TagManager-TagSelect-createTagOption');
      await page.fill(
        'data-testid=TagManager-TagDialog-titleField',
        ActivistTag.title
      );

      await page.click('data-testid=submit-button');

      // Show error
      expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(
        1
      );
    });
  });

  test.describe('editing tags', () => {
    test.beforeEach(async ({ page, appUri, moxy }) => {
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
    test('can edit a tag', async ({ page, moxy }) => {
      const editTagRequest = moxy.setZetkinApiMock(
        `/orgs/1/people/tags/${ActivistTag.id}`,
        'patch',
        ActivistTag
      );

      await page.locator('text=Add tag').click();
      await page.click(
        `data-testid=TagManager-TagSelect-editTag-${ActivistTag.id}`
      );

      await page.fill(
        'data-testid=TagManager-TagDialog-titleField',
        'New tag title'
      );

      // Check that request made to edit tag with correct values
      await Promise.all([
        page.click('data-testid=submit-button'),
        page.waitForResponse(`**/orgs/1/people/tags/${ActivistTag.id}`),
      ]);

      expect(editTagRequest.log()[0].data).toEqual({
        group_id: ActivistTag.group?.id,
        title: 'New tag title',
      });
    });

    test('shows error when editing tag fails', async ({ page, moxy }) => {
      moxy.setZetkinApiMock(
        `/orgs/1/people/tags/${ActivistTag.id}`,
        'patch',
        {},
        409
      );
      await page.locator('text=Add tag').click();
      await page.click(
        `data-testid=TagManager-TagSelect-editTag-${ActivistTag.id}`
      );

      await page.fill(
        'data-testid=TagManager-TagDialog-titleField',
        'New tag title'
      );

      // Show error
      await Promise.all([
        page.click('data-testid=submit-button'),
        page.waitForResponse(`**/orgs/1/people/tags/${ActivistTag.id}`),
      ]);
      expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(
        1
      );
    });
  });
});
