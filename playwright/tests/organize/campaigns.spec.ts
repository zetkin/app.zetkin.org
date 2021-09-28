import { expect } from '@playwright/test';
import test from '../../fixtures/next';

import KPD from '../../mockData/orgs/KPD';
import ReferendumSignatures  from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import WelcomeNewMembers from '../../mockData/orgs/KPD/campaigns/WelcomeNewMembers';

test.describe('All campaigns page', () => {

    test.beforeAll(async ({ moxy }) => {
        await moxy.setMock( '/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });
    });

    test.afterEach(async ({ logout }) => {
        await logout();
    });

    test('shows list of campaigns ', async ({ page, appUri, moxy, login }) => {
        const removeCampaignsMock = await moxy.setMock( '/orgs/1/campaigns', 'get', {
            data: {
                data: [ReferendumSignatures, WelcomeNewMembers],
            },
        });

        await login();

        await page.goto(appUri + '/organize/1/campaigns');

        const numCampaignCards = await page.$$eval('data-testid=campaign-card', (items) => items.length);
        expect(numCampaignCards).toEqual(2);

        await removeCampaignsMock();
    });

    test.describe('creating a campaign from the speed dial', async () => {
        test('user can create a new campaign', async ({ appUri, page, moxy, login }) => {
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

            await moxy.setMock( '/orgs/1/campaigns', 'get', {
                data: {
                    data: [WelcomeNewMembers],
                },
            });

            moxy.setMock('/orgs/1/campaigns', 'post', {
                data: {
                    data: ReferendumSignatures,
                },
                status: 201,
            });

            await login();

            await page.goto(appUri + '/organize/1/campaigns#create-campaign');

            // Check form is open
            await expect(await page.isVisible('data-testid=campaign-details-form'));

            // Fill form
            await page.fill('#title', ReferendumSignatures.title);
            await page.fill('#info_text', ReferendumSignatures.info_text);
            await page.fill('input:near(#status)', 'published');
            await page.fill('input:near(#visibility)', ReferendumSignatures.visibility);
            await page.click('button > :text("Submit")');

            // Check for redirect
            await page.waitForNavigation();
            await expect(page.url()).toEqual(appUri + '/organize/1/campaigns/' + ReferendumSignatures.id);
        });
    });

});
