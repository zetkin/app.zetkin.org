import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import RosaLuxemburg from '../../../mockData/users/RosaLuxemburg';

test.describe('Campaign action buttons', async () => {

    test.beforeAll(async ({ login, moxy }) => {
        await moxy.removeMock();
        await login();
        await moxy.setMock('/orgs/1', 'get', {
            data: {
                data: KPD,
            },
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

        await moxy.setMock('/orgs/1/campaigns/1/tasks', 'get', {
            data: {
                data: [],
            },
        });

        await moxy.setMock('/orgs/1/tasks', 'get', {
            data: {
                data: [],
            },
        });
    });

    test.describe('edit campaign dialog', () => {
        const newTitle = 'Edited Title';

        test('allows users to edit campaign details', async ({ page, moxy, appUri }) => {
            const removePeopleSearchMock = await moxy.setMock('/orgs/1/search/person', 'post', {
                data: {
                    data: [RosaLuxemburg],
                },
            });

            await page.goto(appUri + '/organize/1/campaigns/1');

            // Open modal
            await page.click('data-testid=campaign-action-buttons-menu-activator');
            await page.click('data-testid=campaign-action-buttons-edit-campaign');

            await moxy.removeMock('/orgs/1/campaigns/1', 'get'); // Remove existing mock
            const removeEditedCampaignMock = await moxy.setMock('/orgs/1/campaigns/1', 'get', { // After editing task
                data: {
                    data: {
                        ...ReferendumSignatures,
                        title: newTitle,
                    },
                },
            });

            // Edit title
            await page.fill('#title', newTitle);

            // Set manager
            await page.click('[name=manager_id]');
            await page.fill('[name=manager_id]', 'Rosa');
            await page.click('text="Rosa Luxemburg"');

            // Submit the form
            await page.click('button > :text("Submit")');

            // Check that title changes on page
            const campaignTitle = page.locator('data-testid=page-title');
            await expect(campaignTitle).toContainText(newTitle);

            // Check that patch was made correctly
            const { log } = await moxy.logRequests();
            const patchRequest = log.find(req =>
                req.method === 'PATCH' &&
                req.path === '/v1/orgs/1/campaigns/1',
            );

            expect(patchRequest?.data).toMatchObject({
                manager_id: RosaLuxemburg.id,
                title: newTitle,
            });

            // Clean up mocks
            await removeEditedCampaignMock();
            await removePeopleSearchMock();

            // Reset campaign mock back to "pre edit" state
            await moxy.setMock('/orgs/1/campaigns/1', 'get', {
                data: {
                    data: ReferendumSignatures,
                },
            });
        });

        test('shows error alert if server error on request', async ({ appUri, page, moxy }) => {
            const removePatchTaskMock = await moxy.setMock('/orgs/1/campaigns/1', 'patch', {
                data: {
                    data: {},
                },
                status: 401,
            });

            await page.goto(appUri + '/organize/1/campaigns/1');

            // Open modal
            await page.click('data-testid=campaign-action-buttons-menu-activator');
            await page.click('data-testid=campaign-action-buttons-edit-campaign');

            // Edit task
            await page.fill('#title', newTitle);
            await page.click('button > :text("Submit")');

            // Check that alert shows
            await expect(page.locator('data-testid=error-alert')).toBeVisible();

            await removePatchTaskMock();
        });
    });
});
