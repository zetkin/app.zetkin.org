import { expect } from '@playwright/test';
import test from '../../fixtures/next';

import KPD from '../../mockData/orgs/KPD';
import ReferendumSignatures  from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

test.describe('Single campaign page', () => {

    test.beforeAll(async ({ moxy }) => {
        await moxy.setMock( '/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });

        await moxy.setMock( '/orgs/1/campaigns/1', 'get', {
            data: {
                data: ReferendumSignatures,
            },
        });

        await moxy.setMock( '/orgs/1/campaigns/1/actions', 'get', {
            data: {
                data: [],
            },
        });

        await moxy.setMock( '/orgs/1/campaigns/1/tasks', 'get', {
            data: {
                data: [],
            },
        });

        await moxy.setMock( '/orgs/1/tasks', 'get', {
            data: {
                data: [],
            },
        });
    });

    test.describe('creating a task', () => {
        test.beforeAll(async ({ moxy }) => {
            // All campaigns request for create task campaign select options
            await moxy.setMock( '/orgs/1/campaigns', 'get', {
                data: {
                    data: [ReferendumSignatures],
                },
            });
        });

        test('user can create an offline task', async ({ page, appUri, login, moxy }) => {
            // Submit create task form response
            await moxy.setMock( '/orgs/1/tasks', 'post', {
                data: {
                    data: SpeakToFriend,
                },
                status: 201,
            });

            // Response for task detail page
            await moxy.setMock( '/orgs/1/tasks/1', 'get', {
                data: {
                    data: SpeakToFriend,
                },
            });

            await login();

            // Open create task modal with URL
            await page.goto(appUri + '/organize/1/campaigns/1#create-task');

            // Check form is open
            await expect(await page.isVisible('data-testid=task-details-form'));

            // Fill form
            await page.fill('#title', SpeakToFriend.title);
            await page.fill('#instructions', SpeakToFriend.instructions);
            await page.fill('input:near(#type)', SpeakToFriend.type);

            await page.click('button > :text("Submit")');
            await page.waitForNavigation(); // Closing the modal
            await page.waitForNavigation(); // Redirecting to new page
            await expect(page.url()).toEqual(appUri + '/organize/1/campaigns/1/calendar/tasks/' + SpeakToFriend.id);
        });

        // test.skip('shows error alert when response error', async () => {});
    });


});
