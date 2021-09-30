import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import ReferendumSignatures  from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import WelcomeNewMembers from '../../../mockData/orgs/KPD/campaigns/WelcomeNewMembers';

test.describe('All campaigns page', () => {

    test.beforeAll(async ({ moxy, login }) => {
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

    test('shows list of campaigns ', async ({ page, appUri, moxy }) => {
        const removeCampaignsMock = await moxy.setMock( '/orgs/1/campaigns', 'get', {
            data: {
                data: [ReferendumSignatures, WelcomeNewMembers],
            },
        });

        await page.goto(appUri + '/organize/1/campaigns');

        const numCampaignCards = await page.$$eval('data-testid=campaign-card', (items) => items.length);
        expect(numCampaignCards).toEqual(2);

        await removeCampaignsMock();
    });
});
