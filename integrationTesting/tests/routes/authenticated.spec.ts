import test from '../../fixtures/next';
import {
  addSessionCookie,
  AUTHENTICATED_PAGE_ROUTES,
  expectRouteHealthy,
  mockBetaRouteHandlers,
  routePath,
  setupFeatureFlags,
  setupSmokeApiMocks,
} from './smokeUtils';

test.describe('authenticated route smoke tests', () => {
  test.setTimeout(120000);

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('loads all authenticated page routes without render or translation errors', async ({
    appUri,
    context,
    login,
    moxy,
    page,
  }) => {
    setupFeatureFlags();
    login();
    setupSmokeApiMocks(moxy);
    await addSessionCookie(context, appUri);
    await mockBetaRouteHandlers(page);

    for (const route of AUTHENTICATED_PAGE_ROUTES) {
      const path = await routePath(route);
      await expectRouteHealthy(page, appUri, path);
    }
  });
});
