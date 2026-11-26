import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import {
  addSessionCookie,
  setupFeatureFlags,
  setupSmokeApiMocks,
} from '../../../routes/smokeUtils';

const blacklistReasons = [
  { label: 'they have unsubscribed', reason: 'unsub_org' },
  { label: 'emails have bounced', reason: 'bounce' },
  { label: 'of any reason', reason: 'any' },
];

test.describe('Email blacklist filter', () => {
  test.beforeEach(async ({ appUri, context, login, moxy }) => {
    setupFeatureFlags();
    login();
    setupSmokeApiMocks(moxy);
    moxy.setZetkinApiMock('/orgs/1/people/queries/ephemeral/stats', 'post', []);
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', {
      ...AllMembers,
      content_query: {
        filter_spec: [
          {
            config: { operator: 'blacklisted', reason: 'any' },
            op: 'add',
            type: 'email_blacklist',
          },
        ],
        id: 1,
      },
    });
    await addSessionCookie(context, appUri);
  });

  test.afterEach(async ({ moxy, page }) => {
    await page.close();
    moxy.teardown();
  });

  for (const { label, reason } of blacklistReasons) {
    test(`saves and displays the ${reason} API value`, async ({
      appUri,
      moxy,
      page,
    }) => {
      const query = {
        filter_spec: [
          {
            config: { operator: 'blacklisted', reason },
            op: 'add',
            type: 'email_blacklist',
          },
        ],
        id: 1,
      };
      const patch = moxy.setZetkinApiMock(
        '/orgs/1/people/views/1/content_query',
        'patch',
        query
      );

      await page.goto(`${appUri}/organize/1/people/lists/1`);
      await page.getByTestId('ZUIEllipsisMenu-menuActivator').first().click();
      await page
        .getByRole('menuitem', { name: 'Edit Smart Search query' })
        .click();
      const dialog = page.getByRole('dialog');
      await expect(
        dialog.getByText('of any reason', { exact: true })
      ).toBeVisible();
      await dialog.getByTestId('QueryOverview-editFilterButton').last().click();
      await dialog.getByRole('combobox').last().click();
      await expect(page.getByRole('option')).toHaveText(
        blacklistReasons.map((option) => option.label)
      );
      await page.getByRole('option', { exact: true, name: label }).click();
      await dialog.getByTestId('FilterForm-saveButton').click();
      await expect(dialog.getByText(label, { exact: true })).toBeVisible();
      await dialog.getByTestId('QueryOverview-saveButton').click();

      await expect
        .poll(() => patch.log().map((request) => request.data))
        .toEqual([{ filter_spec: query.filter_spec }]);
    });
  }
});
