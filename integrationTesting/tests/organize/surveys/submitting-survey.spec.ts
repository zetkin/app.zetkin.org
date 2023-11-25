import { expect } from '@playwright/test';

import KPD from '../../../mockData/orgs/KPD';
import KPDMembershipSurvey from '../../../mockData/orgs/KPD/surveys/MembershipSurvey';
import RosaLuxemburg from '../../../mockData/orgs/KPD/people/RosaLuxemburg';
import RosaLuxemburgUser from '../../../mockData/users/RosaLuxemburgUser';
import test from '../../../fixtures/next';
import { ZetkinSurveyQuestionResponse } from 'utils/types/zetkin';

test.describe('User submitting a survey', () => {
  const apiPostPath = `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`;

  test.beforeEach(async ({ appUri, login, moxy, page }) => {
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

    login(RosaLuxemburgUser, [
      {
        organization: KPD,
        profile: {
          id: RosaLuxemburg.id,
          name: RosaLuxemburg.first_name + ' ' + RosaLuxemburg.last_name,
        },
        role: null,
      },
    ]);

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('submits responses', async ({ moxy, page }) => {
    await page.click('input[name="1.options"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="authenticated"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);
    const [request] = log;
    const data = request.data as {
      responses: ZetkinSurveyQuestionResponse[];
    };
    expect(data.responses.length).toBe(2);
    expect(data.responses).toMatchObject([
      {
        options: [1],
        question_id: KPDMembershipSurvey.elements[0].id,
      },
      {
        question_id: KPDMembershipSurvey.elements[1].id,
        response: 'Topple capitalism',
      },
    ]);
  });

  test('submits email signature', async ({ moxy, page }) => {
    await page.click('input[name="1.options"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="email"]');
    await page.fill('input[name="sig.email"]', 'testuser@example.org');
    await page.fill('input[name="sig.first_name"]', 'Test');
    await page.fill('input[name="sig.last_name"]', 'User');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);
    const [request] = log;
    const data = request.data as {
      signature: {
        email: string;
        first_name: string;
        last_name: string;
      };
    };
    expect(data.signature).toMatchObject({
      email: 'testuser@example.org',
      first_name: 'Test',
      last_name: 'User',
    });
  });
});
