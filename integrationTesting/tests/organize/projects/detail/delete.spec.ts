import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatures from '../../../../mockData/orgs/KPD/projects/ReferendumSignatures';

test.describe('Project detail page', async () => {
  test.beforeEach(async ({ login, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock('/orgs/1/projects/1', 'get', ReferendumSignatures);
    moxy.setZetkinApiMock('/orgs/1/projects/1/actions', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/projects/1/tasks', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/call_assignments', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/surveys', 'get', []);
    moxy.setZetkinApiMock('/orgs/1/tasks', 'get', []);
    login();
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('allows users to delete a project', async ({ page, moxy, appUri }) => {
    const { log } = moxy.setZetkinApiMock(
      '/orgs/1/projects/1',
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/projects/1');

    await page.click('header [data-testid=ZUIEllipsisMenu-menuActivator]');
    await page.click('data-testid=ZUIEllipsisMenu-item-deleteProject');

    await page.click('button:text("Confirm")');
    await page.waitForURL(appUri + '/organize/1/projects');
    expect(log().length).toEqual(1);
  });
});
