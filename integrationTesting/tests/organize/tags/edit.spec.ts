import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';

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

  test('lets user edit a tag', async ({ page, moxy }) => {
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
      page.click('data-testid=SubmitCancelButtons-submitButton'),
      page.waitForResponse(`**/orgs/1/people/tags/${ActivistTag.id}`),
    ]);

    expect(editTagRequest.log()[0].data).toEqual({
      group_id: ActivistTag.group?.id,
      title: 'New tag title',
    });
  });
});
