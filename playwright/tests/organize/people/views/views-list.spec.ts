import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import KPD from '../../../../mockData/orgs/KPD';

test.describe('Views list page', () => {

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

    test.describe('views list table', () => {

        test('informs user they do not have any views if list is empty', async ({ page, appUri, moxy }) => {
            const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
                data: {
                    data: [],
                },
                status: 200,
            });

            await page.goto(appUri + '/organize/1/people/views');
            expect(await page.locator('data-testid=empty-views-list-indicator').count()).toEqual(1);

            await removeViewsMock();
        });

        test('displays available views to the user', async ({ page, appUri, moxy }) => {
            const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
                data: {
                    data: [
                        AllMembers,
                        {
                            created: '2021-11-21T12:59:19',
                            id: 2,
                            owner: {
                                id: 1,
                                name: 'Rosa Luxemburg',
                            },
                            title: 'Second View',
                        },
                    ],
                },
                status: 200,
            });

            await page.goto(appUri + '/organize/1/people/views');
            expect(await page.locator('.MuiDataGrid-row').count()).toEqual(2);

            await removeViewsMock();
        });

        test('navigates to view page when user clicks view', async ({ page, appUri, moxy }) => {
            const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
                data: {
                    data: [
                        AllMembers,
                    ],
                },
                status: 200,
            });

            await page.goto(appUri + '/organize/1/people/views');

            await page.click(`text=${AllMembers.title}`);

            await page.waitForNavigation();

            await expect(page.url()).toEqual(appUri + `/organize/1/people/views/${AllMembers.id}`);

            await removeViewsMock();
        });

        test.describe('delete view', () => {

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

                await page.click('data-testid=EllipsisMenu-menuActivator');
                await page.click(`data-testid=EllipsisMenu-item-delete-view`);
                await page.click('button > :text("Submit")');

                // Check body of request
                const mocks = await moxy.logRequests();
                const deleteViewRequest = await mocks.log.find(mock =>
                    mock.method === 'DELETE' &&
                    mock.path === `/v1/orgs/1/people/views/${AllMembers.id}`,
                );
                expect(deleteViewRequest).toBeTruthy();
                expect(await page.locator('data-testid=Snackbar-success').count()).toEqual(1);

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

                await page.click('data-testid=EllipsisMenu-menuActivator');
                await page.click(`data-testid=EllipsisMenu-item-delete-view`);
                await page.click('button > :text("Submit")');

                expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(1);

                await removeViewsMock();
                await removeDeleteViewMock();
            });
        });
    });
});
