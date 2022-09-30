import { expect } from '@playwright/test';

import ActivistTag from '../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingTag from '../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../mockData/orgs/KPD';
import test from '../../../fixtures/next';

test.describe('Profile page tags section', () => {
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

  test('displays relevant tags', async ({ moxy, appUri, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`,
      'get',
      [ActivistTag, CodingTag]
    );

    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingTag,
    ]);

    await Promise.all([
      page.waitForResponse(`**/orgs/${KPD.id}/people/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/people/${ClaraZetkin.id}/tags`),
      page.waitForResponse(`**/orgs/${KPD.id}/tag_groups`),
      page.goto(appUri + `/organize/${KPD.id}/people/${ClaraZetkin.id}`),
    ]);

    expect(
      await page.locator(`text="${ActivistTag.title}"`).isVisible()
    ).toBeTruthy();
    expect(
      await page.locator(`text="${CodingTag.title}"`).isVisible()
    ).toBeTruthy();
  });
});
