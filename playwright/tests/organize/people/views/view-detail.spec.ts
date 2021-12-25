import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import RosaLuxemburg from '../../../../mockData/users/RosaLuxemburg';

test.describe('View detail page', () => {

    test.beforeAll(async ({ moxy, login }) => {
        await moxy.removeMock();
        await login();

        await moxy.setMock( '/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });
    });

    test.afterAll(async ({ moxy }) => {
        await moxy.removeMock();
    });

    test('displays view title and content to the user', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: AllMembersRows,
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });

        await page.goto(appUri + '/organize/1/people/views/1');
        expect(await page.locator('text=All KPD members >> visible=true').count()).toEqual(1);
        expect(await page.locator('text=Clara').count()).toEqual(1);
        expect(await page.locator('text=Rosa').count()).toEqual(1);

        await removeViewsMock();
        await removeRowsMock();
        await removeColsMock();
    });

    test('allows title to be changed', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        await moxy.setMock('/v1/orgs/1/people/views/1', 'patch', {
            status: 200,
        });

        const inputSelector = 'data-testid=page-title >> input';

        // Click to edit, fill and submit change
        await page.goto(appUri + '/organize/1/people/views/1');
        await page.click(inputSelector);
        await page.fill(inputSelector, 'Friends of Zetkin');
        await page.keyboard.press('Enter');

        // Check body of request
        const mocks = await moxy.logRequests();
        const titleUpdateRequest = await mocks.log.find(mock =>
            mock.method === 'PATCH' &&
            mock.path === '/v1/orgs/1/people/views/1',
        );
        expect(titleUpdateRequest?.data).toEqual({ title: 'Friends of Zetkin' });

        await removeViewsMock();
    });

    test('jumps between views using jump menu', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [ AllMembers, NewView ],
            },
            status: 200,
        });
        const removeViewMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: AllMembersRows,
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });

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

        await removeViewsMock();
        await removeViewMock();
        await removeRowsMock();
        await removeColsMock();
    });

    test('add person to empty view', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [ AllMembers, NewView ],
            },
            status: 200,
        });
        const removeViewMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: [],
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });
        const removePeopleSearchMock = await moxy.setMock('/orgs/1/search/person', 'post', {
            data: {
                data: [RosaLuxemburg],
            },
        });
        const removePutRowMock = await moxy.setMock('/orgs/1/people/views/1/rows/1', 'put', {
            data: {
                data: {
                    content: [
                        RosaLuxemburg.first_name,
                        RosaLuxemburg.last_name,
                        false,
                    ],
                    id: RosaLuxemburg.id,
                },
            },
            status: 201,
        });
        const removeDeleteQueryMock = await moxy.setMock('/orgs/1/people/views/1/content_query', 'delete', {
            status: 204,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Add person statically
        await page.click('[name=person]');
        await page.fill('[name=person]', 'Rosa');
        await page.click('text="Rosa Luxemburg"');
        await page.waitForTimeout(200);

        // Make sure the row was added
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'PUT' &&
            req.path === '/v1/orgs/1/people/views/1/rows/1',
        )).toBeTruthy();

        // Make sure previous content query was deleted
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/content_query',
        )).toBeTruthy();

        // Make sure rows are fetched anew
        expect((await moxy.logRequests()).log.filter(req =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows',
        ).length).toBeGreaterThan(1);

        await removeViewsMock();
        await removeViewMock();
        await removeRowsMock();
        await removeColsMock();
        await removePeopleSearchMock();
        await removePutRowMock();
        await removeDeleteQueryMock();
    });

    test('configure Smart Search query in empty view', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [ AllMembers, NewView ],
            },
            status: 200,
        });
        const removeViewMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: [],
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });
        const removePatchQueryMock = await moxy.setMock('/orgs/1/people/queries/1', 'patch', {
            data: {
                data: {
                    filter_spec: [{
                        config: {},
                        op: 'add',
                        type: 'all',
                    }],
                    id: 1,
                },
            },
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
        expect((await moxy.logRequests()).log.find(req =>
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
        expect((await moxy.logRequests()).log.filter(req =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows',
        ).length).toBeGreaterThan(1);

        await removeViewsMock();
        await removeViewMock();
        await removeRowsMock();
        await removeColsMock();
        await removePatchQueryMock();
    });
});
