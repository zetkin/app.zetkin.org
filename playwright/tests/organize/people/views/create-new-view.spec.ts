import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../mockData/orgs/KPD/people/views/NewView/columns';


test.describe('Views list page', () => {

    test.afterEach(async ({ moxy }) => {
        await moxy.clearLog();
    });

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

    test('shows an error dialog if there is an error creating the new view', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [],
            },
            status: 200,
        });

        const removeViewPostErrorMock = await moxy.setMock('/orgs/1/people/views', 'post', {
            status: 500,
        });

        await page.goto(appUri + '/organize/1/people/views');
        await page.click('data-testid=create-view-action-button');

        // Expect error dialog to exist on page
        expect(await page.locator('data-testid=create-view-error-dialog').count()).toEqual(1);

        await removeViewsMock();
        await removeViewPostErrorMock();
    });

    test(
        'creates a new view with two columns for first and last name and redirects to new view',
        async ({ page, appUri, moxy }) => {
            const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
                data: {
                    data: [],
                },
                status: 200,
            });

            const removeNewViewGetMock = await moxy.setMock('/orgs/1/people/views/2', 'get', {
                data: {
                    data: NewView,
                },
                status: 200,
            });

            const removeViewPostSuccessMock = await moxy.setMock('/orgs/1/people/views', 'post', {
                data: {
                    data: NewView,
                },
                status: 203,
            });

            const removeColumnPostMock = await moxy.setMock(`/orgs/1/people/views/${NewView.id}/columns`, 'post', {
                data: {
                    data: NewViewColumns[0],
                },
                status: 200,
            });

            const removeColumnGetMock = await moxy.setMock(`/orgs/1/people/views/${NewView.id}/columns`, 'get', {
                data: {
                    data: NewViewColumns,
                },
                status: 200,
            });

            await page.goto(appUri + '/organize/1/people/views');
            await page.click('data-testid=create-view-action-button');

            await page.waitForNavigation();

            // Get POST requests for creating new view and columns
            const { log } = await moxy.logRequests<{title: string}>();
            const columnPostLogs = log.filter(log => log.path === `/v1/orgs/1/people/views/${NewView.id}/columns` && log.method === 'POST');
            const viewPostLogs = log.filter(log => log.path === '/v1/orgs/1/people/views' && log.method === 'POST');

            // Expect requests to be made
            expect(viewPostLogs).toHaveLength(1);
            expect(columnPostLogs).toHaveLength(2);
            // Expect that correctly localised strings sent when posting
            expect(viewPostLogs[0].data?.title).toEqual('New View');
            expect(columnPostLogs[0].data?.title).toEqual('First name');
            expect(columnPostLogs[1].data?.title).toEqual('Last name');

            // Expect that user is navigated to new view's page
            await expect(page.url()).toEqual(appUri + `/organize/1/people/views/${NewView.id}`);

            await removeViewsMock();
            await removeViewPostSuccessMock();
            await removeColumnPostMock();
            await removeColumnGetMock();
            await removeNewViewGetMock();
        },
    );
});

