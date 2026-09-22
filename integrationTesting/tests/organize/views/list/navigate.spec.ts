import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import KPD from '../../../../mockData/orgs/KPD';

test.describe('Views list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('navigates to view page when user clicks view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers]);
    moxy.setZetkinApiMock('/orgs/1/people/view_folders', 'get', []);

    await page.goto(appUri + '/organize/1/people');

    await page.click(`text=${AllMembers.title}`);

    await page.waitForURL(appUri + `/organize/1/people/lists/${AllMembers.id}`);
  });
});
