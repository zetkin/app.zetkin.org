import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Creating a view column', () => {

    test.beforeEach(async ({ moxy, login }) => {
        await moxy.removeMock();
        await login();

        await moxy.setMock( '/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });

        await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });

        // Rows with only data of first two columns
        await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: AllMembersRows.map(row => {
                    return { ...row, content: [row.content[0], row.content[1]] };
                }),
            },
            status: 200,
        });

        // Only first two columns
        await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: [AllMembersColumns[0], AllMembersColumns[1]],
            },
            status: 200,
        });
    });

    test.afterEach(async ({ moxy }) => {
        await moxy.removeMock();
    });


    test('the user can create a new column', async ({ page, appUri, moxy }) => {
    // Mock for post req to create new column
        await moxy.setMock('/orgs/1/people/views/1/columns', 'post', {
            data: { data: AllMembersColumns[2] },
            status: 201,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Remove existing mocks
        await moxy.removeMock();

        // Replace mocks
        await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });

        await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: AllMembersRows,
            },
            status: 200,
        });

        // Create new toggle column
        await page.click('data-testid=ViewDataTableToolbar-createColumn');
        await page.click('data-testid=column-type-selector-local_bool');

        // Check body of request
        const mocks = await moxy.logRequests();
        const columnPostReq = mocks.log.find(mock => mock.method === 'POST' && mock.path === '/v1/orgs/1/people/views/1/columns');
        expect(columnPostReq?.data).toEqual({ title: 'Toggle', type: 'local_bool' });
    });

    test('shows an error modal if there is an error creating the column', async ({ page, appUri, moxy }) => {
        await moxy.setMock('/orgs/1/people/views/1/columns', 'post', {
            data: { error: '' },
            status: 404,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Create new toggle column
        await page.click('data-testid=ViewDataTableToolbar-createColumn');
        await page.click('data-testid=column-type-selector-local_bool');

        expect(await page.locator('data-testid=data-table-error-indicator').count()).toEqual(1);
    });

});
