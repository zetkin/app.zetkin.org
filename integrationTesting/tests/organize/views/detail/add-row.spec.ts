import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import AllCustomFields from '../../../../mockData/orgs/KPD/people/views/AllMembers/fields';
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
    moxy.setZetkinApiMock('/orgs/1/people/fields', 'get', AllCustomFields);
    moxy.setZetkinApiMock('/orgs/1/search/person', 'post', [NewPerson]);
    moxy.setZetkinApi2Mock(
      '/orgs/1/lists/1/rows',
      'post',
      {
        added: null,
        added_by_user_id: null,
        cells: {
          '1': NewPerson.first_name,
          '2': NewPerson.last_name,
          '3': false,
        },
        id: NewPerson.id,
      },
      201
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test.skip('lets user add row to empty view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApi2Mock('/orgs/1/lists/1/rows', 'get', []);
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
      page.waitForResponse('**/orgs/1/lists/1/rows**'),
      page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`),
    ]);

    // Make sure the row was added
    expect(
      moxy
        .log()
        .find(
          (req) =>
            req.method === 'POST' && req.path === '/v2/orgs/1/lists/1/rows'
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

    // Make sure rows are reloaded after the content query was removed
    expect(
      moxy
        .log()
        .filter(
          (req) =>
            req.method === 'GET' && req.path === '/v2/orgs/1/lists/1/rows'
        ).length
    ).toBeGreaterThan(1);
  });

  test('lets user add row to non-empty view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApi2Mock(
      '/orgs/1/lists/1/rows',
      'get',
      AllMembersRows.slice(0, 1)
    );

    await page.goto(appUri + '/organize/1/people/lists/1');

    // Add person statically
    await page.click('[name=person]');
    await page.fill('[name=person]', `${NewPerson.last_name}`);

    await page.click(`text="${NewPerson.first_name} ${NewPerson.last_name}"`);

    // Make sure the row was added
    await expect
      .poll(() =>
        moxy
          .log()
          .find(
            (req) =>
              req.method === 'POST' && req.path === '/v2/orgs/1/lists/1/rows'
          )
      )
      .toBeTruthy();
  });
});
