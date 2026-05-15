import { expect } from '@playwright/test';

import test from '../../fixtures/next';

test.describe('SSR translations on public pages', () => {
  test('Accept-Language: de renders German translations and lang="de"', async ({
    page,
    appUri,
  }) => {
    await page.context().setExtraHTTPHeaders({ 'Accept-Language': 'de' });

    const response = await page.goto(appUri + '/nonexistent-page');
    expect(response?.status()).toBe(404);

    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(
      page.getByText('zurück zur Startseite').first()
    ).toBeVisible();
  });

  test('Accept-Language: sv renders Swedish translations and lang="sv"', async ({
    page,
    appUri,
  }) => {
    await page.context().setExtraHTTPHeaders({ 'Accept-Language': 'sv' });

    await page.goto(appUri + '/nonexistent-page');

    await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
    await expect(
      page.getByText('Tillbaka till startsidan').first()
    ).toBeVisible();
  });

  test('NEXT_LOCALE cookie overrides Accept-Language header', async ({
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
        value: 'sv',
      },
    ]);
    await page.context().setExtraHTTPHeaders({ 'Accept-Language': 'de' });

    await page.goto(appUri + '/nonexistent-page');

    await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
    await expect(
      page.getByText('Tillbaka till startsidan').first()
    ).toBeVisible();
  });

  test('changing NEXT_LOCALE cookie reflects on next page load', async ({
    page,
    context,
    appUri,
  }) => {
    const url = new URL(appUri);

    // Start in German
    await context.addCookies([
      {
        domain: url.hostname,
        name: 'NEXT_LOCALE',
        path: '/',
        value: 'de',
      },
    ]);
    await page.goto(appUri + '/nonexistent-page');
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');

    // Switch to Swedish
    await context.addCookies([
      {
        domain: url.hostname,
        name: 'NEXT_LOCALE',
        path: '/',
        value: 'sv',
      },
    ]);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
    await expect(
      page.getByText('Tillbaka till startsidan').first()
    ).toBeVisible();
  });
});
