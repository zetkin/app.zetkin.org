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
    });
});
