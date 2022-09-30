import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';
import OrganizerTag from '../../../mockData/orgs/KPD/tags/Organizer';
import PlaysGuitarTag from '../../../mockData/orgs/KPD/tags/PlaysGuitar';

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

    await Promise.all([
      page.waitForResponse(`**/orgs/${KPD.id}/people/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/tag_groups`),
      page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`),
    ]);

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
});
