import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import ReferendumSignatures  from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import WelcomeNewMembers from '../../../mockData/orgs/KPD/campaigns/WelcomeNewMembers';

test.describe('All campaigns page speed dial', () => {

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

    test.describe('allows user to create a campiagn', async () => {
        test.beforeAll(async ({ moxy }) => {
            await moxy.setMock( '/orgs/1/campaigns', 'get', {
                data: {
                    data: [WelcomeNewMembers],
                },
            });
        });

        test.afterAll(async ({ moxy })=> {
            await moxy.removeMock( '/orgs/1/campaigns', 'get');
        });

        test.afterEach(async ({ moxy }) => {
            moxy.removeMock('/orgs/1/campaigns', 'post');
        });

        test('user can create a new campaign', async ({ appUri, page, moxy }) => {
            await moxy.setMock('/orgs/1/campaigns', 'post', {
                data: {
                    data: ReferendumSignatures,
                },
                status: 201,
            });

            await moxy.setMock('/orgs/1/campaigns/1', 'get', {
                data: {
                    data: ReferendumSignatures,
                },
            });

            await moxy.setMock('/orgs/1/campaigns/1/actions', 'get', {
                data: {
                    data: [],
                },
            });

            await page.goto(appUri + '/organize/1/campaigns#create-campaign');

            // Fill form
            await page.fill('#title', ReferendumSignatures.title);
            await page.fill('#info_text', ReferendumSignatures.info_text);
            await page.fill('input:near(#status)', 'published');
            await page.fill('input:near(#visibility)', ReferendumSignatures.visibility);
            await page.click('button > :text("Submit")');

            // Check for redirect
            await page.waitForNavigation();
            await page.waitForNavigation();
            await expect(page.url()).toEqual(appUri + '/organize/1/campaigns/' + ReferendumSignatures.id);
        });

        test('shows error alert when response error', async ({ page, moxy, appUri }) => {
            await moxy.setMock('/orgs/1/tasks', 'post', {
                data: {
                    data: {},
                },
                status: 400,
            });

            await page.goto(appUri + '/organize/1/campaigns#create-campaign');

            // No error alert on page load
            await expect(page.locator('data-testid=error-alert')).toBeHidden();

            // Fill form
            await page.fill('#title', ReferendumSignatures.title);
            await page.fill('#info_text', ReferendumSignatures.info_text);
            await page.fill('input:near(#status)', 'published');
            await page.fill('input:near(#visibility)', ReferendumSignatures.visibility);
            await page.click('button > :text("Submit")');

            // Shows alert
            await expect(page.locator('data-testid=error-alert')).toBeVisible();
            // Does not navigate and keeps open modal
            await expect(page.url()).toEqual(appUri + '/organize/1/campaigns#create-campaign');
        });
    });
});
