import { expect } from '@playwright/test';

import test from '../../fixtures/next';
import Memberships from '../../mockData/orgs/KPD/Memberships';
import RosaLuxemburgUser from '../../mockData/users/RosaLuxemburgUser';
import {
  addSessionCookie,
  expectRouteHealthy,
  routePath,
  setupFeatureFlags,
  setupSmokeApiMocks,
  SUPERUSER_PAGE_ROUTES,
} from './smokeUtils';

test.describe('superuser route smoke tests', () => {
  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  for (const route of SUPERUSER_PAGE_ROUTES) {
    test(`loads ${route.template} without render or translation errors`, async ({
      appUri,
      context,
      login,
      moxy,
      page,
    }) => {
      setupFeatureFlags();
      login({ ...RosaLuxemburgUser, is_superuser: true });
      setupSmokeApiMocks(moxy);
      moxy.setZetkinApiMock(
        `/users/${RosaLuxemburgUser.id}`,
        'get',
        RosaLuxemburgUser
      );
      moxy.setZetkinApiMock(
        `/users/${RosaLuxemburgUser.id}/memberships`,
        'get',
        Memberships
      );
      await addSessionCookie(context, appUri);

      const path = await routePath(route);
      await expectRouteHealthy(page, appUri, path, route.expectedStatus);

      if (route.template === '/manage/users/[userId]') {
        await expect(
          page.getByText(RosaLuxemburgUser.email, { exact: true })
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(appUri + '/manage/users');
        await expect(
          page.getByRole('textbox', { name: 'Search by email or name' })
        ).toBeVisible();
      }
    });
  }
});
