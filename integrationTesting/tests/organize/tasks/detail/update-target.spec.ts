import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import ReferendumSignatureCollection from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';

const filter = {
  filter_spec: [
    {
      config: {},
      op: 'add',
      type: 'all',
    },
  ],
  id: 1,
};

test.describe('Task detail page', async () => {
  test.beforeEach(({ login, moxy }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', SpeakToFriend);
    moxy.setZetkinApiMock(
      '/orgs/1/campaigns/1',
      'get',
      ReferendumSignatureCollection
    );
    moxy.setZetkinApiMock('/orgs/1/tasks/1/assigned', 'get', []);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user update target using SmartSearch Dialog', async ({
    page,
    moxy,
    appUri,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/queries/1', 'patch', filter);

    await page.goto(
      appUri + '/organize/1/projects/1/calendar/tasks/1/assignees'
    );

    // Open Smart Search dialog
    await page.click('data-testid=QueryStatusAlert-actionButton');
    await page.click('data-testid=QueryOverview-editFilterButton');
    await page.click('data-testid=StartsWith-select');
    await page.click('data-testid=StartsWith-select-all');
    await page.click('data-testid=FilterForm-saveButton');

    await Promise.all([
      page.waitForResponse(
        `**/orgs/1/people/queries/${SpeakToFriend.target.id}`
      ),
      page.click('data-testid=QueryOverview-saveButton'),
    ]);

    // Check body of request
    const patchRequest = moxy
      .log()
      .find(
        (req) =>
          req.method === 'PATCH' &&
          req.path === `/v1/orgs/1/people/queries/${SpeakToFriend.target.id}`
      );

    expect(patchRequest?.data).toEqual({
      filter_spec: [
        {
          config: {},
          op: 'add',
          type: 'all',
        },
      ],
    });
  });
});
