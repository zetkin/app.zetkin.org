import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Renaming a view column', () => {

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


    test('the user can rename an existing column', async ({ page, appUri, moxy }) => {
        const newTitle = 'Chosen Name';
        await moxy.setMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'patch', {
            data: {
                data: {
                    ...AllMembersColumns[0],
                    title: newTitle,
                },
            },
            status: 201,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Rename first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click(`data-testid=rename-column-button-col_${AllMembersColumns[0].id}`);

        await page.fill('#rename-column-title-field', newTitle);
        await page.click('button > :text("Save")');

        // Check body of request
        const mocks = await moxy.logRequests();
        const columnPatchRequest = mocks.log.find(mock =>
            mock.method === 'PATCH' &&
            mock.path === `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
        );
        expect(columnPatchRequest?.data).toEqual({ title: newTitle });
    });

    test('shows an error modal if there is an error renaming the column', async ({ page, appUri, moxy }) => {
        await moxy.setMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'patch', {
            data: {
                error: '',
            },
            status: 400,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Rename first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click(`data-testid=rename-column-button-col_${AllMembersColumns[0].id}`);

        await page.fill('#rename-column-title-field', 'New title');
        await page.click('button > :text("Save")');

        expect(await page.locator('data-testid=data-table-error-indicator').count()).toEqual(1);
    });

});
