import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import AllMembers from '../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../mockData/orgs/KPD';
import NewView from '../../../mockData/orgs/KPD/people/views/NewView';

test('Navigating to /organize/:orgId/people/views redirects to views page', async ({
  login,
  page,
  appUri,
  moxy,
}) => {
  login();
  moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  moxy.setZetkinApiMock('/orgs/1/people/views', 'get', []);

  await page.goto(appUri + '/organize/1/people/views');

  // Expect to have been redirected
  expect(page.url()).not.toEqual(appUri + '/organize/1/people/views');
  expect(page.url()).toEqual(appUri + '/organize/1/people');

  moxy.teardown();
});

test('Clicking the "Views" breadcrumb redirects to views page', async ({
  login,
  page,
  appUri,
  moxy,
}) => {
  login();
  moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers, NewView]);
  moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
  moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
  moxy.setZetkinApiMock(
    '/orgs/1/people/views/1/columns',
    'get',
    AllMembersColumns
  );

  await page.goto(appUri + '/organize/1/people/views/1');

  await page.click('Views');

  // Expect to have been redirected
  expect(page.url()).not.toEqual(appUri + '/organize/1/people/views');
  expect(page.url()).toEqual(appUri + '/organize/1/people');

  moxy.teardown();
});
