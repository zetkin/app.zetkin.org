import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ReferendumSignatureCollection from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

test.describe('Task assignees', async () => {

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

        await moxy.setMock('/orgs/1/tasks/1/assigned', 'get', {
            data: {
                data: [],
            },
        });
    });

    test('update target using Smart Search Dialog', async ({ page, moxy, appUri }) => {
        const removePatchQueryMock = await moxy.setMock('/orgs/1/people/queries/1', 'patch', {
            data: {
                data: {
                    filter_spec: [{
                        config: {},
                        op: 'add',
                        type: 'all',
                    }],
                    id: 1,
                },
            },
        });

        await page.goto(appUri + '/organize/1/campaigns/1/calendar/tasks/1/assignees');

        // Open Smart Search dialog
        await page.click('data-testid=QueryStatusAlert-actionButton');
        await page.click('data-testid=StartsWith-select');
        await page.click('data-testid=StartsWith-select-all');
        await page.click('data-testid=FilterForm-saveButton');
        await page.click('data-testid=QueryOverview-saveButton');

        // Check body of request
        const log = await moxy.logRequests();
        const patchRequest = await log.log.find(req =>
            req.method === 'PATCH' &&
            req.path === `/v1/orgs/1/people/queries/${SpeakToFriend.target.id}`,
        );

        expect(patchRequest?.data).toEqual({
            filter_spec: [{
                config: {},
                op: 'add',
                type: 'all',
            }],
        });

        await removePatchQueryMock();
    });
});
