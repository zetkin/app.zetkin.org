import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import KPD from '../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';

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
            const removePatchTaskMock = await moxy.setMock('/orgs/1/campaigns/1', 'patch', {
                data: {
                    data: {
                        ...ReferendumSignatures,
                        title: newTitle,
                    },
                },
            });

            await page.goto(appUri + '/organize/1/campaigns/1');

            // Open modal
            await page.click('data-testid=campaign-action-buttons-menu-activator');
            await page.click('data-testid=campaign-action-buttons-edit-campaign');

            await moxy.removeMock('/orgs/1/campaigns/1', 'get'); // Remove existing mock
            const removeEditedTaskMock = await moxy.setMock('/orgs/1/campaigns/1', 'get', { // After editing task
                data: {
                    data: {
                        ...ReferendumSignatures,
                        title: newTitle,
                    },
                },
            });

            // Edit task
            await page.fill('#title', newTitle);
            await page.click('button > :text("Submit")');

            // Check that title changes on page
            const taskTitle = page.locator('data-testid=page-title');
            await expect(taskTitle).toContainText(newTitle);

            // Clean up mocks
            await removePatchTaskMock();
            await removeEditedTaskMock();
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
