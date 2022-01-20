import { expect, Page } from '@playwright/test';
import test, { Moxy } from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';

const deleteView = async (page: Page) => {
    await page.click('data-testid=EllipsisMenu-menuActivator');
    await page.click(`data-testid=EllipsisMenu-item-delete-view`);
    await page.click('button > :text("Confirm")');
};

const expectDeleteViewError = async (page: Page) => {
    await page.locator('data-testid=Snackbar-error').waitFor();
    const canSeeErrorSnackbar = await page.locator('data-testid=Snackbar-error').isVisible();
    expect(canSeeErrorSnackbar).toBeTruthy();
};

const expectDeleteViewSuccess = async (page: Page, moxy: Moxy) => {
    const mocks = await moxy.logRequests();
    const deleteViewRequest = await mocks.log.find((mock) =>
        mock.method === 'DELETE' &&
                mock.path === `/v1/orgs/1/people/views/${AllMembers.id}`,
    );
    expect(deleteViewRequest).toBeTruthy();
};

test.describe('Delete view from view list page', () => {

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

    test('user can delete a view from a menu in the list', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [
                    AllMembers,
                ],
            },
            status: 200,
        });

        const removeDeleteViewMock = await moxy.setMock(`/orgs/1/people/1/views/${AllMembers.id}`, 'delete', {
            status: 204,
        });

        await page.goto(appUri + '/organize/1/people/views');

        await deleteView(page);
        await expectDeleteViewSuccess(page, moxy);

        await removeViewsMock();
        await removeDeleteViewMock();
    });

    test('shows an error if view deletion fails', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [
                    AllMembers,
                ],
            },
            status: 200,
        });

        const removeDeleteViewMock = await moxy.setMock(`/orgs/1/people/1/views/${AllMembers.id}`, 'delete', {
            status: 405,
        });

        await page.goto(appUri + '/organize/1/people/views');

        await deleteView(page);
        await expectDeleteViewError(page);

        await removeViewsMock();
        await removeDeleteViewMock();
    });
});

test.describe('Delete view from view detail page', () => {
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

        await deleteView(page);
        await expectDeleteViewSuccess(page, moxy);

        // Check navigates back to views list
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

        await deleteView(page);
        await expectDeleteViewError(page);

        await removeDeleteMock();
        await removeViewsMock();
        await removeRowsMock();
        await removeColsMock();
    });
});
