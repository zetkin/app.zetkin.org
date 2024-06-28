import { expect } from '@playwright/test';

import test from '../../../fixtures/next';
import KPD from '../../../mockData/orgs/KPD';

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
