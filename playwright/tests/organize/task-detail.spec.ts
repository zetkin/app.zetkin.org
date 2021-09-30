import { expect } from '@playwright/test';
import test from '../../fixtures/next';

import ReferendumSignatureCollection from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

test.describe('Task detail page', async () => {

    test.beforeAll(async ({ login, moxy }) => {
        await moxy.removeMock();
        await login();

        await moxy.setMock('/orgs/1/tasks/1', 'get', {
            data: {
                data: SpeakToFriend,
            },
        });

        await moxy.setMock('/orgs/1/campaigns/1', 'get', {
            data: {
                data: ReferendumSignatureCollection,
            },
        });
    });

    test.describe('action buttons', () => {
        test.describe('edit task', () => {

            test('allows users to edit task details', async ({ page, moxy, appUri }) => {
                const newTitle = 'Speak to a family member';

                await moxy.setMock('/orgs/1/tasks/1', 'patch', {
                    data: {
                        data: {
                            ...SpeakToFriend,
                            title: newTitle,
                        },
                    },
                });

                await page.goto(appUri + '/organize/1/campaigns/1/calendar/tasks/1');

                // Open modal
                await page.click('data-testid=task-action-buttons-menu-activator');
                await page.click('data-testid=task-action-buttons-edit-task');

                await moxy.removeMock('/orgs/1/tasks/1', 'get'); // Remove existing mock
                const removeEditedTaskMock = await moxy.setMock('/orgs/1/tasks/1', 'get', { // After editing task
                    data: {
                        data: {
                            ...SpeakToFriend,
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
                removeEditedTaskMock();
                await moxy.setMock('/orgs/1/tasks/1', 'get', {
                    data: {
                        data: SpeakToFriend,
                    },
                });
            });

            test('shows error alert if server error on request', async () => {
                test.skip();
            });
        });
    });
});
