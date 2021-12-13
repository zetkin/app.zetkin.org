import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';


test('the user can rename an existing column', async ({ page, appUri, moxy, login }) => {
    await moxy.removeMock();
    await login();


    await moxy.setMock( '/orgs/1', 'get', {
        data: {
            data: KPD,
        },
    });

    await moxy.setMock('/orgs/1/people/views/1', 'get', {
        data: {
            data: AllMembers,
        },
        status: 200,
    });
    // Rows with only data of first two columns
    const removeRowsMock = await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
        data: {
            data: AllMembersRows.map(row => {
                return { ...row, content: [row.content[0], row.content[1]] };
            }),
        },
        status: 200,
    });
        // Only first two columns
    const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
        data: {
            data: [AllMembersColumns[0], AllMembersColumns[1]],
        },
        status: 200,
    });

    // Mock for post req to create new column
    await moxy.setMock('/orgs/1/people/views/1/columns', 'post', {
        data: { data: AllMembersColumns[2] },
        status: 201,
    });

    await page.goto(appUri + '/organize/1/people/views/1');


    // Remove existing mocks
    await removeRowsMock();
    await removeColsMock();

    // Replace mocks
    await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
        data: {
            data: AllMembersColumns,
        },
        status: 200,
    });

    await moxy.setMock('/orgs/1/people/views/1/rows', 'get', {
        data: {
            data: AllMembersRows,
        },
        status: 200,
    });

    // Create new toggle column
    await page.click('data-testid=create-column-button');
    await page.click('data-testid=column-type-selector-local_bool');

    // Check body of request
    const mocks = await moxy.logRequests();
    const columnPostReq = mocks.log.find(mock => mock.method === 'POST' && mock.path === '/v1/orgs/1/people/views/1/columns');
    expect(columnPostReq?.data).toEqual({ title: 'Toggle', type: 'local_bool' });

    await moxy.removeMock();
});
