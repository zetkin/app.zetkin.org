import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';

test.describe('Journey instance notes', () => {
  test.beforeEach(async ({ moxy, login, page, appUri }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
      'get',
      MemberOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/timeline/updates`,
      'get',
      []
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('can make a note', async ({ moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/timeline/updates`,
      'get',
      []
    );
    const notePostMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/notes`,
      'post',
      {}
    );
    // Click on notes text input
    await page.click('[data-slate-editor=true]');
    await page.type('[data-slate-editor=true]', 'Note text!');

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/notes`
      ),
      page.click('[data-testid=SubmitCancelButtons-submitButton]'),
    ]);

    expect(notePostMock.log()[0].data).toEqual({
      file_ids: [],
      text: 'Note text!\n',
    });
  });
});
