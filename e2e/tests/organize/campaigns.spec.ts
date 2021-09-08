import test from '../../fixtures/next';

test('loads index page', async ({ page, next: { appUri, moxy }, login }) => {
    await login();

    await moxy.setMock('get', '/v1/orgs/1', {
        data: {
            data: {
                id: 1,
                title: 'Deutsche Kommunistiche Partei',
            },
        },
    });

    await moxy.setMock('get', '/v1/orgs/1/campaigns/1', {
        data: {
            data: {
                id: 1,
                title: 'Gegen die Freikorps kampfen',
            },
        },
    });

    await moxy.setMock('get', '/v1/orgs/1/tasks/1', {
        data: {
            data: {
                campaign: {
                    id: 1,
                },
                config: {},
                id: 1,
                instructions: 'Mit nem waffe oder messer',
                organization: {
                    id: 1,
                },
                target: {
                    filter_spec: [],
                },
                title: 'Friedrich Ebert umbringen',
                type: 'offline',

            },
        },
    });

    await page.goto(appUri + '/organize/1/campaigns/1/calendar/tasks/1');
    await page.waitForTimeout(1000000);
});
