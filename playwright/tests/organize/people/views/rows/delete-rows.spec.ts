import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('View detail page', () => {

    test.beforeAll(async ({ moxy, login }) => {
        await moxy.removeMock();
        await login();

        await moxy.setMock('/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });
    });

    test.afterAll(async ({ moxy }) => {
        await moxy.removeMock();
    });

    test('Remove people from view', async ({ page, appUri, moxy }) => {
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
        const removeDeleteQueryMock = await moxy.setMock('/v1/orgs/1/people/views/1/rows/1', 'delete', { status: 204 });

        const removeButton = 'data-testid=ViewDataTableToolbar-removeFromSelection';
        const confirmButtonInModal = 'button:has-text("confirm")';
        await page.goto(appUri + '/organize/1/people/views/1');

        // Show toolbar button on row selection
        await expect(page.locator(removeButton)).toBeHidden();
        await page.locator('[role=cell]:has-text("Clara")').click();
        await expect(page.locator(removeButton)).toBeVisible();

        // Show modal on click remove button -> click confirm to close modal
        await page.locator(removeButton).click();
        await expect(page.locator(confirmButtonInModal)).toBeVisible();
        await page.locator(confirmButtonInModal).click();
        await expect(page.locator(confirmButtonInModal)).toBeHidden();

        // Check for delete request
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/rows/1',
        )).toBeTruthy();

        await removeViewsMock();
        await removeRowsMock();
        await removeColsMock();
        await removeDeleteQueryMock();
    });
});
