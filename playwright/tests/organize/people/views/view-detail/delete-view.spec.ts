import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';

test.describe('Delete view', () => {

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

    test('successfully deletes a view', async ({ page, appUri, moxy }) => {
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

        const removeDeleteMock = await moxy.setMock('/orgs/1/people/views/1', 'delete', {
            status: 204,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        await page.click('data-testid=EllipsisMenu-menuActivator');
        await page.click('data-testid=EllipsisMenu-item-delete');
        await page.click('button > :text("Submit")');

        await page.waitForNavigation();
        await expect(page.url()).toEqual(appUri + `/organize/${KPD.id}/people/views`);

        await removeDeleteMock();
        await removeViewsMock();
        await removeRowsMock();
        await removeColsMock();
    });

    test('shows snackbar if error deleting view', async ({ page, appUri, moxy }) => {
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

        const removeDeleteMock = await moxy.setMock('/orgs/1/people/views/1', 'delete', {
            status: 405,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        await page.click('data-testid=EllipsisMenu-menuActivator');
        await page.click('data-testid=EllipsisMenu-item-delete');
        await page.click('button > :text("Submit")');

        expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);

        await removeDeleteMock();
        await removeViewsMock();
        await removeRowsMock();
        await removeColsMock();
    });

});
