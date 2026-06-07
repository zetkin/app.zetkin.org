import { expect } from '@playwright/test';

import test from '../../fixtures/next';

/**
 * Verifies the SSR locale chain end-to-end on a public route:
 *
 *   request → middleware → next-intl rewrite → [locale]/layout.tsx
 *           → [locale]/[...rest]/page.tsx (catch-all)
 *           → notFound() → [locale]/not-found.tsx (localized body)
 *
 * `<html lang>` confirms the layout-level locale resolution, and the
 * translated body text confirms that the not-found.tsx rendered with
 * the correct messages loaded.
 */
test.describe('SSR translations on public pages', () => {
  test.describe('German browser', () => {
    test.use({ locale: 'de' });

    test('renders German translations and lang="de"', async ({
      page,
      appUri,
    }) => {
      const response = await page.goto(appUri + '/nonexistent-page');

      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(
        page.getByText('zurück zur Startseite').first()
      ).toBeVisible();
    });
  });

  test.describe('Swedish browser', () => {
    test.use({ locale: 'sv' });

    test('renders Swedish translations and lang="sv"', async ({
      page,
      appUri,
    }) => {
      const response = await page.goto(appUri + '/nonexistent-page');

      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
      await expect(
        page.getByText('Tillbaka till startsidan').first()
      ).toBeVisible();
    });
  });

  test.describe('NEXT_LOCALE cookie overrides Accept-Language', () => {
    test.use({ locale: 'de' });

    test('cookie wins over header', async ({ page, context, appUri }) => {
      const url = new URL(appUri);
      await context.addCookies([
        {
          domain: url.hostname,
          name: 'NEXT_LOCALE',
          path: '/',
          value: 'sv',
        },
      ]);

      const response = await page.goto(appUri + '/nonexistent-page');

      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
      await expect(
        page.getByText('Tillbaka till startsidan').first()
      ).toBeVisible();
    });
  });

  test.describe('Locale switching via cookie change', () => {
    test('changing NEXT_LOCALE cookie reflects on next page load', async ({
      page,
      context,
      appUri,
    }) => {
      const url = new URL(appUri);

      await context.addCookies([
        {
          domain: url.hostname,
          name: 'NEXT_LOCALE',
          path: '/',
          value: 'de',
        },
      ]);
      const response = await page.goto(appUri + '/nonexistent-page');
      expect(response?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(
        page.getByText('zurück zur Startseite').first()
      ).toBeVisible();

      await context.addCookies([
        {
          domain: url.hostname,
          name: 'NEXT_LOCALE',
          path: '/',
          value: 'sv',
        },
      ]);
      const reloaded = await page.reload();
      expect(reloaded?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
      await expect(
        page.getByText('Tillbaka till startsidan').first()
      ).toBeVisible();
    });
  });
});
