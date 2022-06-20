import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import ClarasOnboardingTimelineUpdates from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding/updates';
import ClaraZetkin from '../../../../mockData/orgs/KPD/people/ClaraZetkin';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinNote } from '../../../../../src/types/zetkin';
import { UPDATE_TYPES, ZetkinUpdate } from '../../../../../src/types/updates';

const newNote: ZetkinNote = {
  files: [],
  id: 2,
  text: 'BOSCO',
};

const newUpdate: ZetkinUpdate = {
  actor: {
    first_name: ClaraZetkin.first_name,
    id: ClaraZetkin.id,
    last_name: ClaraZetkin.last_name,
  },
  details: {
    note: newNote,
  },
  organization: KPD,
  target: ClarasOnboarding,
  timestamp: '2022-06-20T00:00:00',
  type: UPDATE_TYPES.JOURNEYINSTANCE_ADDNOTE,
};

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
      ClarasOnboardingTimelineUpdates
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test.only('can make a note', async ({ moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/timeline/updates`,
      'get',
      [newUpdate, ...ClarasOnboardingTimelineUpdates]
    );
    const notePostMock = moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/notes`,
      'post',
      {}
    );

    await page.click('[data-slate-editor=true]');
    await page.type('[data-slate-editor=true]', newNote.text);

    await Promise.all([
      page.waitForResponse(
        `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/notes`
      ),
      page.click('[data-testid=SubmitCancelButtons-submitButton]'),
    ]);

    expect(notePostMock.log()[0].data).toEqual({
      file_ids: [],
      text: `${newNote.text}\n`,
    });
  });
});
