import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClarasOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import PlaysGuitarTag from '../../../../mockData/orgs/KPD/tags/PlaysGuitar';
import { ZetkinJourneyInstance } from '../../../../../src/utils/types/zetkin';

test.describe('Closing and reopening a journey instance', () => {
  test.beforeEach(async ({ moxy, login }) => {
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
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/people/tags`, 'get', [
      ActivistTag,
      CodingSkillsTag,
      PlaysGuitarTag,
    ]);
    moxy.setZetkinApiMock(`/orgs/${KPD.id}/tag_groups`, 'get', []);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test.describe('can close an instance', () => {
    test('by clicking the close button and filling out the outcome form', async ({
      appUri,
      moxy,
      page,
    }) => {
      const instanceCloseMock = moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'patch',
        {
          ...ClarasOnboarding,
          closed: null,
          tags: [...ClarasOnboarding.tags, CodingSkillsTag],
        }
      );

      const tagPutMock = moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`,
        'put'
      );

      const outcomeNote =
        'The member has accepted the immortal science of Marxist Leninism';

      await page.goto(appUri + '/organize/1/journeys/1/1');

      // Click close instance button
      await page.locator('data-testid=JourneyInstanceCloseButton').click();

      // Add outcome
      await page.fill(
        'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=JourneyInstanceCloseButton-outcomeNoteField',
        outcomeNote
      );

      // Add tags
      await page
        .locator(
          'data-testid=JourneyInstanceCloseButton-outcomeDialog >> text=Add tag'
        )
        .click();
      await page.click(`text=${CodingSkillsTag.title}`);

      // Submit close
      const submitButton = page.locator(
        'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=SubmitCancelButtons-submitButton'
      );

      await Promise.all([
        page.waitForResponse((res) => res.request().method() === 'POST'),
        (async () => {
          await submitButton.click({ force: true }); // To close the tag select popover
          await submitButton.click();
        })(),
      ]);

      // Check requests to tags made
      expect(tagPutMock.log().length).toEqual(1);

      // Check patch request has correct data
      expect(instanceCloseMock.log().length).toEqual(1);
    });

    test.describe('Shows an error', () => {
      test('if adding tags fails', async ({ moxy, page, appUri }) => {
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`,
          'put',
          undefined,
          401
        );

        await page.goto(appUri + '/organize/1/journeys/1/1');

        // Click close instance button
        await page.locator('data-testid=JourneyInstanceCloseButton').click();

        // Add outcome
        await page.fill(
          'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=JourneyInstanceCloseButton-outcomeNoteField',
          'Outcome note content'
        );

        // Add tags
        await page
          .locator(
            'data-testid=JourneyInstanceCloseButton-outcomeDialog >> text=Add tag'
          )
          .click();
        await page.click(`text=${CodingSkillsTag.title}`);

        // Submit close
        const submitButton = page.locator(
          'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=SubmitCancelButtons-submitButton'
        );

        await Promise.all([
          page.waitForResponse((res) => res.request().method() === 'POST'),
          (async () => {
            await submitButton.click({ force: true }); // To close the tag select popover
            await submitButton.click();
          })(),
        ]);

        expect(
          await page.locator('data-testid=Snackbar-error').count()
        ).toEqual(1);
      });

      test('if patching the instance fails', async ({ page, moxy, appUri }) => {
        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
          'patch',
          undefined,
          504
        );

        moxy.setZetkinApiMock(
          `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}/tags/${CodingSkillsTag.id}`,
          'put'
        );

        await page.goto(appUri + '/organize/1/journeys/1/1');

        // Click close instance button
        await page.locator('data-testid=JourneyInstanceCloseButton').click();

        // Add outcome
        await page.fill(
          'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=JourneyInstanceCloseButton-outcomeNoteField',
          'Outcome note content'
        );

        // Add tags
        await page
          .locator(
            'data-testid=JourneyInstanceCloseButton-outcomeDialog >> text=Add tag'
          )
          .click();
        await page.click(`text=${CodingSkillsTag.title}`);

        // Submit close
        const submitButton = page.locator(
          'data-testid=JourneyInstanceCloseButton-outcomeDialog >> data-testid=SubmitCancelButtons-submitButton'
        );

        await Promise.all([
          page.waitForResponse((res) => res.request().method() === 'POST'),
          (async () => {
            await submitButton.click({ force: true }); // To close the tag select popover
            await submitButton.click();
          })(),
        ]);

        // Show error
        const snackbar = page.locator('data-testid=Snackbar-error');
        await snackbar.waitFor();

        expect(await snackbar.count()).toEqual(1);
      });
    });
  });

  test.describe('can reopen an instance', () => {
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
