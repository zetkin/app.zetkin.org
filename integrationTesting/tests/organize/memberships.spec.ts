import { expect } from '@playwright/test';
import test from '../../fixtures/next';

import KPD from '../../mockData/orgs/KPD';
import RosaLuxemburg from '../../mockData/orgs/KPD/people/RosaLuxemburg';
import RosaLuxemburgUser from '../../mockData/users/RosaLuxemburgUser';

test.describe('User gets 404 when trying to access org pages', () => {
  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('if they are not member of the org', async ({ appUri, login, page }) => {
    const memberships = [
      {
        organization: {
          id: 666,
          title: 'Satanist Monster Org',
        },
        profile: {
          id: RosaLuxemburg.id,
          name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
        },
        role: 'witch',
      },
    ];

    login(RosaLuxemburgUser, memberships);
    const response = await page.goto(appUri + '/organize/1/campaigns');
    expect(response?.status()).toEqual(404);
  });

  test('if they are member of org but do not have a role', async ({
    appUri,
    login,
    page,
  }) => {
    const memberships = [
      {
        organization: KPD,
        profile: {
          id: RosaLuxemburg.id,
          name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
        },
        role: null,
      },
    ];

    login(RosaLuxemburgUser, memberships);
    const response = await page.goto(appUri + '/organize/1/campaigns');
    expect(response?.status()).toEqual(404);
  });
});
