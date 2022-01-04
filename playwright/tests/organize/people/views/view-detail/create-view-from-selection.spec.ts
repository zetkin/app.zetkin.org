import { expect } from '@playwright/test';
import test from '../../../../../fixtures/next';

import AllMembers from '../../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../../mockData/orgs/KPD';
import NewView from '../../../../../mockData/orgs/KPD/people/views/NewView';
import NewViewColumns from '../../../../../mockData/orgs/KPD/people/views/NewView/columns';


test('Create view from selection', async ({ appUri, login, moxy, page }) => {

    await moxy.removeMock();
    await login();

    await moxy.setMock( '/orgs/1', 'get', {
        data: {
            data: KPD,
        },
    });

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
            data: AllMembersRows,
        },
        status: 200,
    });
    const removeColsMock = await moxy.setMock('/orgs/1/people/views/1/columns', 'get', {
        data: {
            data: AllMembersColumns,
        },
        status: 200,
    });
    const removePostViewMock = await moxy.setMock('/orgs/1/people/views', 'post', {
        data: {
            data: NewView,
        },
        status: 203,
    });
    const removePostColumnMock = await moxy.setMock(`/orgs/1/people/views/${NewView.id}/columns`, 'post', {
        data: {
            data: NewViewColumns[0],
        },
        status: 200,
    });
    const removePutRow1Mock = await moxy.setMock(`/orgs/1/people/views/${NewView.id}/rows/1`, 'put', {
        data: {
            data: {
                content: ['Clara', 'Zetkin'],
                id: 1,
            },
        },
        status: 200,
    });
    const removePutRow2Mock = await moxy.setMock(`/orgs/1/people/views/${NewView.id}/rows/2`, 'put', {
        data: {
            data: {
                content: ['Clara', 'Zetkin'],
                id: 1,
            },
        },
        status: 200,
    });


    await page.goto(appUri + '/organize/1/people/views/1');

    await page.locator('[role=cell] >> input[type=checkbox]').nth(0).click();
    await page.locator('[role=cell] >> input[type=checkbox]').nth(1).click();
    await page.click('data-testid=ViewDataTableToolbar-createFromSelection');

    await page.waitForNavigation();

    // Get POST requests for creating new view and columns
    const { log } = await moxy.logRequests<{title: string}>();
    const columnPostLogs = log.filter(log => log.path == `/v1/orgs/1/people/views/${NewView.id}/columns` && log.method == 'POST');
    const viewPostLogs = log.filter(log => log.path == '/v1/orgs/1/people/views' && log.method == 'POST');
    const rowPutLogs = log.filter(log => log.path.startsWith(`/v1/orgs/1/people/views/${NewView.id}/rows/`) && log.method == 'PUT');

    // Expect requests to be made
    expect(viewPostLogs).toHaveLength(1);
    expect(columnPostLogs).toHaveLength(2);

    // Expect that correctly localised strings sent when posting
    expect(viewPostLogs[0].data?.title).toEqual('New View');
    expect(columnPostLogs[0].data?.title).toEqual('First name');
    expect(columnPostLogs[1].data?.title).toEqual('Last name');

    // Expect that the correct rows were added
    expect(rowPutLogs[0].path).toMatch(/1$/);
    expect(rowPutLogs[1].path).toMatch(/2$/);

    // Expect that user is navigated to new view's page
    await expect(page.url()).toEqual(appUri + `/organize/1/people/views/${NewView.id}`);

    await removeViewsMock();
    await removeViewMock();
    await removeRowsMock();
    await removeColsMock();
    await removePostViewMock();
    await removePostColumnMock();
    await removePutRow1Mock();
    await removePutRow2Mock();

    await moxy.removeMock();

});
