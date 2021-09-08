import test from '../../fixtures/next';

test('loads index page', async ({ page, next: { appUri, moxy } }) => {
    moxy.setMock('get', '/v1/users/me', {
        data: {
            id: 2,
        },
    });
    moxy.setMock('get', '/v1/session', {
        data: {
            created: '2020-01-01T00:00:00',
            level: 2,
            user: {
                id: 2,
            },
        },
    });
    await page.goto(appUri + '/organize/1/campaigns/1');
});
