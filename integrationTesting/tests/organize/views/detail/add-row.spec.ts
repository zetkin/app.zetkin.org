import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';
import NewView from '../../../../mockData/orgs/KPD/people/views/NewView';

const NewPerson = {
  first_name: 'New',
  id: 1337,
  last_name: 'Person',
};

test.describe('View detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers, NewView]);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
    moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [NewPerson]);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/rows/1',
      'put',
      {
        content: [NewPerson.first_name, NewPerson.last_name, false],
        id: NewPerson.id,
      },
      201
    );
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows/1337', 'get', {
      content: [NewPerson.first_name, NewPerson.last_name, false],
      id: NewPerson.id,
    });
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test.skip('lets user add row to empty view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', []);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/content_query',
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Add person statically
    await page.click('[name=person]');
    await page.fill('[name=person]', `${NewPerson.last_name}`);

    await Promise.all([
      page.waitForResponse('**/orgs/1/people/views/1/rows'),
      page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`),
    ]);

    // Make sure the row was added
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`
        )
    ).toBeTruthy();

    // Make sure previous content query was deleted
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'DELETE' &&
            req.path === '/v1/orgs/1/people/views/1/content_query'
        )
    ).toBeTruthy();

    // Make sure rows are fetched anew
    expect(
      moxy
        .log()
        .filter(
          (req) =>
            req.method === 'GET' &&
            req.path === '/v1/orgs/1/people/views/1/rows'
        ).length
    ).toBeGreaterThan(1);
  });

  test('lets user add row to non-empty view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/rows',
      'get',
      AllMembersRows.slice(0, 1)
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Add person statically
    await page.click('[name=person]');
    await page.fill('[name=person]', `${NewPerson.last_name}`);

    await Promise.all([
      page.waitForResponse(`**/orgs/1/people/views/1/rows/${NewPerson.id}`),
      page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`),
    ]);

    // Make sure the row was added
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'PUT' &&
            req.path === `/v1/orgs/1/people/views/1/rows/${NewPerson.id}`
        )
    ).toBeTruthy();
  });
});
