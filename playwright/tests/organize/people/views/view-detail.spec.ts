import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../mockData/orgs/KPD/people/views/NewView/columns';

const NewPerson = {
    first_name: 'New',
    id: 1337,
    last_name: 'Person',
};

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

    test('create view from selection', async ({ appUri, moxy, page }) => {
        moxy.setZetkinApiMock('/orgs/1/people/views', 'post', NewView, 203);
        moxy.setZetkinApiMock(`/orgs/1/people/views/${NewView.id}/columns`, 'post', NewViewColumns[0]);
        moxy.setZetkinApiMock(`/orgs/1/people/views/${NewView.id}/rows/1`, 'put', {
            content: ['Clara', 'Zetkin'],
            id: 1,
        });
        moxy.setZetkinApiMock(`/orgs/1/people/views/${NewView.id}/rows/2`, 'put', {
            content: ['Clara', 'Zetkin'],
            id: 1,
        });


        await page.goto(appUri + '/organize/1/people/views/1');

        await page.locator('[role=cell] >> input[type=checkbox]').nth(0).click();
        await page.locator('[role=cell] >> input[type=checkbox]').nth(1).click();
        await page.click('data-testid=ViewDataTableToolbar-createFromSelection');

        await page.waitForNavigation();

        // Get POST requests for creating new view and columns
        const log = moxy.log<{title: string}>();
        const columnPostLogs = log.filter(log => log.path == `/v1/orgs/1/people/views/${NewView.id}/columns` && log.method == 'POST');
        const viewPostLogs = log.filter(log => log.path == '/v1/orgs/1/people/views' && log.method == 'POST');
        const rowPutLogs = log.filter(log => log.path.startsWith(`/v1/orgs/1/people/views/${NewView.id}/rows/`) && log.method == 'PUT');

        // Expect requests to be made
        expect(viewPostLogs).toHaveLength(1);
        expect(columnPostLogs).toHaveLength(2);

        // Expect that correctly localised strings sent when posting
        expect(viewPostLogs[0].data?.title).toEqual('New View');
        expect(columnPostLogs[0].data?.title).toEqual('First name');
        expect(columnPostLogs[1].data?.title).toEqual('Last name');

        // Expect that the correct rows were added
        expect(rowPutLogs[0].path).toMatch(/1$/);
        expect(rowPutLogs[1].path).toMatch(/2$/);

        // Expect that user is navigated to new view's page
        await expect(page.url()).toEqual(appUri + `/organize/1/people/views/${NewView.id}`);
    });

    test('add person to empty view', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [NewPerson]);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows/1', 'put',  {
            content: [
                NewPerson.first_name,
                NewPerson.last_name,
                false,
            ],
            id: NewPerson.id,
        }, 201);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/content_query', 'delete', undefined, 204);

        await page.goto(appUri + '/organize/1/people/views/1');

        // Add person statically
        await page.click('[name=person]');
        await page.fill('[name=person]', `${NewPerson.last_name}`);
        await page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`);
        await page.waitForTimeout(200);

        // Make sure the row was added
        expect(moxy.log().find(req =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`,
        )).toBeTruthy();

        // Make sure previous content query was deleted
        expect(moxy.log().find(req =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/content_query',
        )).toBeTruthy();

        // Make sure rows are fetched anew
        expect(moxy.log().filter(req =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows',
        ).length).toBeGreaterThan(1);
    });

    test('add person to non-empty view', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows.slice(0, 1));
        moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [NewPerson]);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows/1', 'put', {
            content: [
                NewPerson.first_name,
                NewPerson.last_name,
                false,
            ],
            id: NewPerson.id,
        }, 201);

        await page.goto(appUri + '/organize/1/people/views/1');

        // Add person statically
        await page.click('[name=person]');
        await page.fill('[name=person]', `${NewPerson.last_name}`);
        await page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`);
        await page.waitForTimeout(200);

        // Make sure the row was added
        expect(moxy.log().find(req =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`,
        )).toBeTruthy();
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
        await page.waitForTimeout(200);

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
