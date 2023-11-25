import { expect } from '@playwright/test';

import KPD from '../../../mockData/orgs/KPD';
import KPDMembershipSurvey from '../../../mockData/orgs/KPD/surveys/MembershipSurvey';
import RosaLuxemburg from '../../../mockData/orgs/KPD/people/RosaLuxemburg';
import RosaLuxemburgUser from '../../../mockData/users/RosaLuxemburgUser';
import test from '../../../fixtures/next';
import {
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
} from 'utils/types/zetkin';

test.describe('User submitting a survey', () => {
  const apiPostPath = `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`;

  test.beforeEach(async ({ appUri, login, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      KPDMembershipSurvey
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
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="user"]');
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
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

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
      signature: ZetkinSurveySignaturePayload;
    };
    expect(data.signature).toMatchObject({
      email: 'testuser@example.org',
      first_name: 'Test',
      last_name: 'User',
    });
  });

  test('submits user signature', async ({ moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"][value="1"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="user"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);
    const [request] = log;
    const data = request.data as {
      signature: ZetkinSurveySignaturePayload;
    };
    expect(data.signature).toBe('user');
  });

  test('submits anonymous signature', async ({ moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"][value="1"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);
    const [request] = log;
    const data = request.data as {
      signature: ZetkinSurveySignaturePayload;
    };
    expect(data.signature).toBe(null);
  });

  test('preserves inputs on error', async ({ page }) => {
    await page.click('input[name="1.options"][value="1"]');
    await page.fill('input[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');

    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    await expect(page.locator('data-testid=Survey-error')).toBeVisible();
    await expect(
      page.locator('input[name="1.options"][value="1"]')
    ).toBeChecked();
    await expect(page.locator('input[name="2.text"]')).toHaveValue(
      'Topple capitalism'
    );
    await expect(
      page.locator('input[name="sig"][value="anonymous"]')
    ).toBeChecked();
    await expect(page.locator('data-testid=Survey-acceptTerms')).toBeChecked();
  });
});
