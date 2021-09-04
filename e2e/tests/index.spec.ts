import test from '../fixtures/next';

test('loads index page', async ({ page, port }) => {
    await page.goto(`http://localhost:${port}`);
});
