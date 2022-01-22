import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';

test.describe('View detail page', () => {

    test.beforeEach(({ moxy, login }) => {
        login();
        moxy.setZetkinApiMock( '/orgs/1', 'get', KPD);
        moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [ AllMembers, NewView ]);
        moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/columns', 'get', AllMembersColumns);
    });

    test.afterEach(({ moxy }) => {
        moxy.teardown();
    });

    test('displays view title and content to the user', async ({ page, appUri }) => {
        await page.goto(appUri + '/organize/1/people/views/1');
        expect(await page.locator('text=All KPD members >> visible=true').count()).toEqual(1);
        expect(await page.locator('text=Clara').count()).toEqual(1);
        expect(await page.locator('text=Rosa').count()).toEqual(1);
    });

    test('allows title to be changed', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock('/v1/orgs/1/people/views/1', 'patch');

        const inputSelector = 'data-testid=page-title >> input';

        // Click to edit, fill and submit change
        await page.goto(appUri + '/organize/1/people/views/1');
        await page.click(inputSelector);
        await page.fill(inputSelector, 'Friends of Zetkin');
        await page.keyboard.press('Enter');
        await page.waitForResponse('**/orgs/1/people/views/1');

        // Check body of request
        const titleUpdateRequest = moxy.log().find(mock =>
            mock.method === 'PATCH' &&
            mock.path === '/v1/orgs/1/people/views/1',
        );
        expect(titleUpdateRequest?.data).toEqual({ title: 'Friends of Zetkin' });
    });

    test('jumps between views using jump menu', async ({ page, appUri }) => {

        await page.goto(appUri + '/organize/1/people/views/1');

        // Click to open the jump menu
        await page.click('data-testid=view-jump-menu-button');

        // Assert that the input is automatically focused, and type in part of the title of NewView
        expect(await page.locator('data-testid=view-jump-menu-popover >> input')).toBeFocused();
        await page.fill('data-testid=view-jump-menu-popover >> input', NewView.title.slice(0, 3));

        // Press down to select view and enter to navigate
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        // Assert that we navigate away to the new view
        await page.waitForNavigation();
        await expect(page.url()).toEqual(appUri + `/organize/1/people/views/${NewView.id}`);
    });

    test('configure Smart Search query in empty view', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get',  []);
        moxy.setZetkinApiMock('/orgs/1/people/queries/1', 'patch', {
            filter_spec: [{
                config: {},
                op: 'add',
                type: 'all',
            }],
            id: 1,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Configure Smart Search query
        await page.click('data-testid=EmptyView-configureButton');
        await page.click('data-testid=StartsWith-select');
        await page.click('data-testid=StartsWith-select-all');
        await page.click('data-testid=FilterForm-saveButton');
        await page.click('data-testid=QueryOverview-saveButton');
        await page.waitForResponse('**/orgs/1/people/views/1/rows');

        // Make sure previous content query was deleted
        expect(moxy.log().find(req =>
            req.method === 'PATCH' &&
            req.path === '/v1/orgs/1/people/views/1/content_query',
        )?.data).toMatchObject({
            filter_spec: [{
                config: {},
                op: 'add',
                type: 'all',
            }],
        });

        // Make sure rows are fetched anew
        expect(moxy.log().filter(req =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows',
        ).length).toBeGreaterThan(1);
    });
});
