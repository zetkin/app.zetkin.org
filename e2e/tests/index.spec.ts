import { test } from '@playwright/test';

test('loads index page', async ({ page }) => {
    await page.goto('http://localhost:3000');
});
