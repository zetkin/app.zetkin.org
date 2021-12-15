import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Deleting a view column', () => {

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

        await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: AllMembersRows,
            },
            status: 200,
        });

        await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });
    });

    test.afterEach(async ({ moxy }) => {
        await moxy.removeMock();
    });


    test('the user can delete an existing column', async ({ page, appUri, moxy }) => {
        await moxy.setMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'delete', {
            status: 200,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Delete first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click('data-testid=delete-column-button-col_1');

        // Check body of request
        const mocks = await moxy.logRequests();
        const columnDeleteRequest = mocks.log.find(mock =>
            mock.method === 'DELETE' &&
            mock.path === `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
        );
        expect(columnDeleteRequest).not.toEqual(undefined);
    });

    test('shows an error modal if there is an error renaming the column', async ({ page, appUri, moxy }) => {
        await moxy.setMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'delete', {
            status: 400,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Delete first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click('data-testid=delete-column-button-col_1');

        expect(await page.locator('data-testid=data-table-error-indicator').count()).toEqual(1);
    });

});
