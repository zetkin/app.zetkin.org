import { expect } from '@playwright/test';

import test from '../../../../fixtures/next';
import ClaraZetkin from '../../../../mockData/orgs/KPD/people/ClaraZetkin';
import {
  addSessionCookie,
  setupFeatureFlags,
  setupSmokeApiMocks,
} from '../../../routes/smokeUtils';

const sent = '2026-10-21T15:53:00+00:00';
const recipient = {
  delivered: null,
  email_address: 'clara@kpd.org',
  error: null,
  id: 1,
  opened: null,
  person: ClaraZetkin,
  sent,
  status: 'sent',
};

test.describe('Email delivery log', () => {
  test.beforeEach(async ({ appUri, context, login, moxy }) => {
    setupFeatureFlags();
    login();
    setupSmokeApiMocks(moxy);
    await addSessionCookie(context, appUri);
  });

  test.afterEach(async ({ moxy, page }) => {
    await page.close();
    moxy.teardown();
  });

  test('shows recipient statuses and existing errors without a bounces endpoint', async ({
    appUri,
    moxy,
    page,
  }) => {
    const recipients = moxy.setZetkinApiMock(
      '/orgs/1/emails/1/recipients',
      'get',
      [
        recipient,
        { ...recipient, delivered: '2026-10-21T15:54:00+00:00', id: 2 },
        {
          ...recipient,
          id: 3,
          opened: '2026-10-21T16:00:00+00:00',
          status: 'opened',
        },
        { ...recipient, error: 'Mailbox unavailable', id: 4, status: 'failed' },
        { ...recipient, delivered: sent, id: 6, status: 'bounced' },
        {
          ...recipient,
          email_address: null,
          id: 5,
          sent: null,
          status: 'pending',
        },
      ]
    );

    await page.goto(`${appUri}/organize/1/projects/1/emails/1/deliveryLog`);
    const grid = page.getByRole('grid');
    await expect(grid).toBeVisible();
    await expect(grid.getByRole('columnheader')).toHaveText([
      '',
      'Name',
      'Email address',
      /^Time/,
      'Status',
      'Error',
    ]);
    for (const status of [
      'Sent',
      'Delivered',
      'Opened',
      'Failed',
      'Pending',
      'Bounced',
    ]) {
      await expect(
        grid.getByRole('gridcell', { exact: true, name: status })
      ).toBeVisible();
    }
    await expect(
      grid.getByRole('gridcell', { name: 'Mailbox unavailable' })
    ).toBeVisible();
    await grid.locator('[data-field="avatar"] a').first().hover();
    await expect(page.locator('#person-hover-card')).toContainText(
      'Clara Zetkin'
    );
    expect(recipients.log()).toHaveLength(1);
    expect(
      moxy.log().filter((request) => request.path.endsWith('/bounces'))
    ).toEqual([]);
  });

  test('preserves a failed API status without stored error details', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/emails/1/recipients', 'get', [
      { ...recipient, delivered: sent, status: 'failed' },
    ]);

    await page.goto(`${appUri}/organize/1/projects/1/emails/1/deliveryLog`);

    const grid = page.getByRole('grid');
    await expect(
      grid.getByRole('gridcell', { exact: true, name: 'Failed' })
    ).toBeVisible();
    await expect(
      grid.getByRole('gridcell', { exact: true, name: 'Delivered' })
    ).toHaveCount(0);
  });

  test('shows the empty state and explains bounce types', async ({
    appUri,
    page,
  }) => {
    await page.goto(`${appUri}/organize/1/projects/1/emails/1/deliveryLog`);
    await expect(page.getByText('No deliveries to show.')).toBeVisible();
    await page.getByRole('button', { name: 'About bounces' }).hover();
    await expect(page.getByRole('tooltip')).toContainText(
      'A hard bounce is a permanent delivery failure'
    );
    await expect(page.getByRole('tooltip')).toContainText(
      'A soft bounce is a temporary delivery failure'
    );
  });
});
