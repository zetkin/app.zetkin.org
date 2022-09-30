import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../../mockData/orgs/KPD';
import { ZetkinJourneyInstance } from '../../../../../src/utils/types/zetkin';

test.describe('Journey instance details page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test.describe('lets user reopen a closed instance', () => {
    test('by clicking the reopen button on a closed case', async ({
      appUri,
      moxy,
      page,
    }) => {
      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'get',
        {
          ...ClarasOnboarding,
          closed: '2022-01-01T00:00:00',
        }
      );

      const patchInstanceMock = moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'patch',
        ClarasOnboarding
      );

      await page.goto(appUri + '/organize/1/journeys/1/1');

      await Promise.all([
        // Wait for request to resolve
        page.waitForResponse(
          `**/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`
        ),
        // Click close instance button
        page.locator('data-testid=JourneyInstanceReopenButton').click(),
      ]);

      // Check patch request has correct data
      expect(
        patchInstanceMock.log<ZetkinJourneyInstance>()[0].data?.closed
      ).toEqual(null);
    });
  });
});
