import { expect } from '@playwright/test';

import test from '../../fixtures/next';
import { REDIRECT_ROUTES, routePath } from './smokeUtils';

test.describe('redirect route smoke tests', () => {
  test.setTimeout(120000);

  test('sends unauthenticated redirect-only routes to a 3xx response', async ({
    appUri,
    page,
  }) => {
    for (const route of REDIRECT_ROUTES) {
      const path = await routePath(route);
      const response = await page.request.get(appUri + path, {
        maxRedirects: 0,
      });

      expect(response.status(), path).toBeGreaterThanOrEqual(300);
      expect(response.status(), path).toBeLessThan(400);
    }
  });
});
