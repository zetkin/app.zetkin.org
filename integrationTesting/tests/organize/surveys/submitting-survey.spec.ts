import { expect } from '@playwright/test';

import KPD from '../../../mockData/orgs/KPD';
import KPDMembershipSurvey from '../../../mockData/orgs/KPD/surveys/MembershipSurvey';
import RosaLuxemburg from '../../../mockData/orgs/KPD/people/RosaLuxemburg';
import RosaLuxemburgUser from '../../../mockData/users/RosaLuxemburgUser';
import test from '../../../fixtures/next';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyApiSubmission,
} from 'utils/types/zetkin';

test.describe('User submitting a survey', () => {
  const apiPostPath = `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`;

  test.beforeEach(async ({ login, moxy }) => {
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
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('submits text input', async ({ appUri, moxy, page }) => {
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    await page.fill('[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toEqual({
      responses: [
        {
          question_id: KPDMembershipSurvey.elements[1].id,
          response: 'Topple capitalism',
        },
      ],
      signature: null,
    });
  });

  test('required text input blocks submission when empty', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 2,
            question: {
              description: '',
              question: 'What would you like to do?',
              required: true,
              response_config: {
                multiline: true,
              },
              response_type: RESPONSE_TYPE.TEXT,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    const requiredTextInput = await page.locator('[name="2.text"]');
    await requiredTextInput.waitFor({ state: 'visible' });

    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await page.click('data-testid=Survey-submit');

    const valueMissing = await requiredTextInput.evaluate(
      (element: HTMLTextAreaElement) => element.validity.valueMissing
    );
    expect(valueMissing).toBe(true);
  });

  test('submits radio input', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 1,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Yes',
                },
                {
                  id: 2,
                  text: 'No',
                },
              ],
              question: 'Do you want to be active?',
              required: false,
              response_config: {
                widget_type: 'radio',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"]');

    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toEqual({
      responses: [
        {
          options: [1],
          question_id: KPDMembershipSurvey.elements[0].id,
        },
      ],
      signature: null,
    });
  });

  test('required radio input blocks submission when empty', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 1,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Yes',
                },
                {
                  id: 2,
                  text: 'No',
                },
              ],
              question: 'Do you want to be active?',
              required: true,
              response_config: {
                widget_type: 'radio',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    const requiredRadioInput = await page.locator(
      '[name="1.options"] >> nth=0'
    );
    await requiredRadioInput.waitFor({ state: 'visible' });

    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await page.click('data-testid=Survey-submit');

    const valueMissing = await requiredRadioInput.evaluate(
      (element: HTMLInputElement) => element.validity.valueMissing
    );
    expect(valueMissing).toBe(true);
  });

  test('submits checkbox input', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 3,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Flyers',
                },
                {
                  id: 2,
                  text: 'Phone banking',
                },
              ],
              question: 'How do you want to help?',
              required: false,
              response_config: {
                widget_type: 'checkbox',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="3.options"][value="1"]');
    await page.click('input[name="3.options"][value="2"]');

    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toEqual({
      responses: [
        {
          options: [1, 2],
          question_id: KPDMembershipSurvey.elements[2].id,
        },
      ],
      signature: null,
    });
  });

  test('submits select input', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 3,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Yes',
                },
                {
                  id: 2,
                  text: 'No',
                },
              ],
              question: 'Is this a select box?',
              required: false,
              response_config: {
                widget_type: 'select',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    const selectInput = await page.locator(
      '[id="mui-component-select-3.options"]'
    );
    const yes = await page.locator('[role="option"][data-value="1"]');

    await selectInput.waitFor({ state: 'visible' });
    await selectInput.click();
    await yes.waitFor({ state: 'visible' });
    await yes.click();

    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toEqual({
      responses: [
        {
          options: [1],
          question_id: 3,
        },
      ],
      signature: null,
    });
  });

  test('required select input blocks submission when empty', async ({
    appUri,
    moxy,
    page,
  }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 3,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Yes',
                },
                {
                  id: 2,
                  text: 'No',
                },
              ],
              question: 'Is this a select box?',
              required: true,
              response_config: {
                widget_type: 'select',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    const selectInput = await page.locator(
      '[id="mui-component-select-3.options"]'
    );
    const hiddenInput = await page.locator('input[name="3.options"]');

    await selectInput.waitFor({ state: 'visible' });
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await page.click('data-testid=Survey-submit');

    const valueMissing = await hiddenInput.evaluate(
      (element: HTMLSelectElement) => element.validity.valueMissing
    );
    expect(valueMissing).toBe(true);
  });

  test('submits untouched "select" widget as []', async ({
    appUri,
    moxy,
    page,
  }) => {
    // Include a select-widget element in the survey
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: [
          {
            hidden: false,
            id: 3,
            question: {
              description: '',
              options: [
                {
                  id: 1,
                  text: 'Yes',
                },
                {
                  id: 2,
                  text: 'No',
                },
              ],
              question: 'Is this a select box?',
              required: false,
              response_config: {
                widget_type: 'select',
              },
              response_type: RESPONSE_TYPE.OPTIONS,
            },
            type: ELEMENT_TYPE.QUESTION,
          },
        ],
      }
    );

    // Respond when survey is submitted
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    // Navigate to survey and submit without touching the select widget (or any)
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toEqual({
      responses: [
        {
          options: [],
          question_id: 3,
        },
      ],
      signature: null,
    });
  });

  test('submits email signature', async ({ appUri, moxy, page }) => {
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"]');
    await page.fill('[name="2.text"]', 'Topple capitalism');
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

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toMatchObject({
      signature: {
        email: 'testuser@example.org',
        first_name: 'Test',
        last_name: 'User',
      },
    });
  });

  test('submits user signature', async ({ appUri, moxy, page }) => {
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"][value="1"]');
    await page.fill('[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="user"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toMatchObject({
      signature: 'user',
    });
  });

  test('submits anonymous signature', async ({ appUri, moxy, page }) => {
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}/submissions`,
      'post',
      {
        timestamp: '1857-05-07T13:37:00.000Z',
      }
    );

    await page.click('input[name="1.options"][value="1"]');
    await page.fill('[name="2.text"]', 'Topple capitalism');
    await page.click('input[name="sig"][value="anonymous"]');
    await page.click('data-testid=Survey-acceptTerms');
    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'POST'),
      await page.click('data-testid=Survey-submit'),
    ]);

    const log = moxy.log(`/v1${apiPostPath}`);
    expect(log.length).toBe(1);

    const data = log[0].data as ZetkinSurveyApiSubmission;
    expect(data).toMatchObject({
      signature: null,
    });
  });

  test('preserves inputs on error', async ({ appUri, page }) => {
    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    await page.click('input[name="1.options"][value="1"]');
    await page.fill('[name="2.text"]', 'Topple capitalism');
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
    await expect(page.locator('[name="2.text"]')).toHaveValue(
      'Topple capitalism'
    );
    await expect(
      page.locator('input[name="sig"][value="anonymous"]')
    ).toBeChecked();
    await expect(page.locator('data-testid=Survey-acceptTerms')).toBeChecked();
  });

  test("doesn't render hidden elements", async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`,
      'get',
      {
        ...KPDMembershipSurvey,
        elements: KPDMembershipSurvey.elements.map((element) => ({
          ...element,
          hidden: true,
        })),
      }
    );

    await page.goto(
      `${appUri}/o/${KPDMembershipSurvey.organization.id}/surveys/${KPDMembershipSurvey.id}`
    );

    const radioInput = await page.locator('input[name="1.options"]');
    const textInput = await page.locator('[name="2.text"]');
    const checkboxInput = await page.locator('input[name="3.options"]');

    expect(await radioInput.isVisible()).toBeFalsy();
    expect(await textInput.isVisible()).toBeFalsy();
    expect(await checkboxInput.isVisible()).toBeFalsy();
  });
});
