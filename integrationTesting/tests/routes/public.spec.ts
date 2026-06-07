import test from '../../fixtures/next';
import {
  addSessionCookie,
  expectRouteHealthy,
  PUBLIC_PAGE_ROUTES,
  routePath,
  setupFeatureFlags,
  setupSmokeApiMocks,
} from './smokeUtils';

test.describe('public route smoke tests', () => {
  test.setTimeout(120000);

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('loads all public page routes without render or translation errors', async ({
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

    for (const route of PUBLIC_PAGE_ROUTES) {
      const path = await routePath(route);
      await expectRouteHealthy(
        page,
        appUri,
        path,
        route.template === '/[...rest]' ? 404 : 200
      );
    }
  });
});
