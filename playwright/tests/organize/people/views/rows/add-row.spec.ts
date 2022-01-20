import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';
import NewView from '../../../../../mockData/orgs/KPD/people/views/NewView';

const NewPerson = {
    first_name: 'New',
    id: 1337,
    last_name: 'Person',
};

test.describe('View detail page', () => {

    test.beforeAll(async ({ moxy, login }) => {
        await moxy.removeMock();
        await login();

        await moxy.setMock('/orgs/1', 'get', {
            data: {
                data: KPD,
            },
        });
    });

    test.afterAll(async ({ moxy }) => {
        await moxy.removeMock();
    });

    test('add person to empty view', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [ AllMembers, NewView ],
            },
            status: 200,
        });
        const removeViewMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                data: [],
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });
        const removePeopleSearchMock = await moxy.setMock('/orgs/1/search/person', 'post', {
            data: {
                data: [NewPerson],
            },
        });
        const removePutRowMock = await moxy.setMock('/orgs/1/people/views/1/rows/1', 'put', {
            data: {
                data: {
                    content: [
                        NewPerson.first_name,
                        NewPerson.last_name,
                        false,
                    ],
                    id: NewPerson.id,
                },
            },
            status: 201,
        });
        const removeDeleteQueryMock = await moxy.setMock('/orgs/1/people/views/1/content_query', 'delete', {
            status: 204,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Add person statically
        await page.click('[name=person]');
        await page.fill('[name=person]', `${NewPerson.last_name}`);
        await page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`);
        await page.waitForTimeout(200);

        // Make sure the row was added
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`,
        )).toBeTruthy();

        // Make sure previous content query was deleted
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/content_query',
        )).toBeTruthy();

        // Make sure rows are fetched anew
        expect((await moxy.logRequests()).log.filter(req =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows',
        ).length).toBeGreaterThan(1);

        await removeViewsMock();
        await removeViewMock();
        await removeRowsMock();
        await removeColsMock();
        await removePeopleSearchMock();
        await removePutRowMock();
        await removeDeleteQueryMock();
    });

    test('add person to non-empty view', async ({ page, appUri, moxy }) => {
        const removeViewsMock = await moxy.setMock('/orgs/1/people/views', 'get', {
            data: {
                data: [ AllMembers, NewView ],
            },
            status: 200,
        });
        const removeViewMock = await moxy.setMock('/orgs/1/people/views/1', 'get', {
            data: {
                data: AllMembers,
            },
            status: 200,
        });
        const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
            data: {
                // Just the first row
                data: AllMembersRows.slice(0, 1),
            },
            status: 200,
        });
        const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
            data: {
                data: AllMembersColumns,
            },
            status: 200,
        });
        const removePeopleSearchMock = await moxy.setMock('/orgs/1/search/person', 'post', {
            data: {
                data: [NewPerson],
            },
        });
        const removePutRowMock = await moxy.setMock('/orgs/1/people/views/1/rows/1', 'put', {
            data: {
                data: {
                    content: [
                        NewPerson.first_name,
                        NewPerson.last_name,
                        false,
                    ],
                    id: NewPerson.id,
                },
            },
            status: 201,
        });

        await page.goto(appUri + '/organize/1/people/views/1');

        // Add person statically
        await page.click('[name=person]');
        await page.fill('[name=person]', `${NewPerson.last_name}`);
        await page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`);
        await page.waitForTimeout(200);

        // Make sure the row was added
        expect((await moxy.logRequests()).log.find(req =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`,
        )).toBeTruthy();

        await removeViewsMock();
        await removeViewMock();
        await removeRowsMock();
        await removeColsMock();
        await removePeopleSearchMock();
        await removePutRowMock();
    });
});
