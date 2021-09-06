import test from '../../fixtures/next';

test('loads index page', async ({ page, appUri }) => {
    await page.goto(appUri);
});
