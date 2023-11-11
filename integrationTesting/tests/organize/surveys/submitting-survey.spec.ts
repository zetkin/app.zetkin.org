import { expect } from '@playwright/test';

import KPD from '../../../mockData/orgs/KPD';
import KPDMembershipSurvey from '../../../mockData/orgs/KPD/surveys/MembershipSurvey';
import RosaLuxemburg from '../../../mockData/orgs/KPD/people/RosaLuxemburg';
import RosaLuxemburgUser from '../../../mockData/users/RosaLuxemburgUser';
import test from '../../../fixtures/next';

test.describe('User submitting a survey', () => {
  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('submits data successfully', async ({ appUri, login, moxy, page }) => {
    const apiPostPath = `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`;

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      KPDMembershipSurvey
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

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
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    await page.fill('input', 'Topple capitalism');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      await page.click('data-testid=Survey-submit'),
      page.waitForResponse((res) => res.request().method() == 'POST'),
    ]);

    const reqLog = moxy.log(`/v1${apiPostPath}`);
    expect(reqLog.length).toBe(1);
    expect(reqLog[0].data).toMatchObject({
      responses: [
        {
          options: [1],
          question_id: KPDMembershipSurvey.elements[0].id,
        },
        {
          question_id: KPDMembershipSurvey.elements[1].id,
          response: 'Topple capitalism',
        },
      ],
    });
  });
});
