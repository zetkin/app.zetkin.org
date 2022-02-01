import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Deleting a view column', () => {

    test.beforeEach(({ moxy, login }) => {
        login();
        moxy.setZetkinApiMock( '/orgs/1', 'get',  KPD);
        moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
        moxy.setZetkinApiMock('/orgs/1/people/views/1/columns', 'get', AllMembersColumns);
    });

    test.afterEach(({ moxy }) => {
        moxy.teardown();
    });

    test('the user can delete an existing column', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'delete');

        await page.goto(appUri + '/organize/1/people/views/1');

        // Delete first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click(`data-testid=delete-column-button-col_${AllMembersColumns[0].id}`);

        // Check body of request
        const columnDeleteRequest = moxy.log().find(mock =>
            mock.method === 'DELETE' &&
            mock.path === `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`,
        );
        expect(columnDeleteRequest).not.toEqual(undefined);
    });

    test('shows an error modal if there is an error deleting the column', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'delete', undefined, 400);

        await page.goto(appUri + '/organize/1/people/views/1');

        // Delete first column
        await page.click('button[aria-label="Menu"]:right-of(:text("First Name"))', { force: true });
        await page.click(`data-testid=delete-column-button-col_${AllMembersColumns[0].id}`);

        expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);
    });

    test('the user must confirm deletion of a column with local data', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock(`/orgs/1/people/views/1/columns/${AllMembersColumns[0].id}`, 'delete');

        await page.goto(appUri + '/organize/1/people/views/1');

        // Delete first column
        await page.click('button[aria-label="Menu"]:right-of(:text("Active"))', { force: true });
        await page.click(`data-testid=delete-column-button-col_${AllMembersColumns[2].id}`);
        await page.click('button > :text("Confirm")');

        // Check body of request
        const columnDeleteRequest = moxy.log().find(mock =>
            mock.method === 'DELETE' &&
            mock.path === `/v1/orgs/1/people/views/1/columns/${AllMembersColumns[2].id}`,
        );
        expect(columnDeleteRequest).not.toEqual(undefined);
    });
});
