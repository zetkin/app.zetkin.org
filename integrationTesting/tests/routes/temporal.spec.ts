import { expect } from '@playwright/test';

import test from '../../fixtures/next';
import SmokeEvent from '../../mockData/orgs/KPD/projects/ReferendumSignatures/events/SmokeEvent';
import {
  addSessionCookie,
  expectRouteHealthy,
  mockBetaRouteHandlers,
  setupFeatureFlags,
  setupSmokeApiMocks,
} from './smokeUtils';

test.describe('Temporal without native browser support', () => {
  test.beforeEach(async ({ appUri, context, login, moxy, page }) => {
    setupFeatureFlags();
    login();
    setupSmokeApiMocks(moxy);
    await addSessionCookie(context, appUri);
    await mockBetaRouteHandlers(page);

    await page.addInitScript(() => {
      Object.defineProperty(globalThis, 'Temporal', {
        configurable: true,
        value: undefined,
        writable: true,
      });
    });
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  for (const { router, path } of [
    { path: '/o/1/events/1', router: 'App Router' },
    {
      path: '/organize/1/projects/1/events/1',
      router: 'Pages Router',
    },
  ]) {
    test(`${router} renders an event using the Temporal polyfill`, async ({
      appUri,
      page,
    }) => {
      await expectRouteHealthy(page, appUri, path);

      expect
        .soft(
          await page.evaluate(
            () => typeof globalThis.Temporal?.PlainDateTime.from
          ),
          `${router} should install Temporal before rendering the event`
        )
        .toBe('function');

      const title =
        router === 'App Router'
          ? page.getByRole('heading', { exact: true, name: SmokeEvent.title! })
          : page.getByPlaceholder(SmokeEvent.title!, { exact: true });
      await expect(title).toBeVisible();
    });
  }
});
