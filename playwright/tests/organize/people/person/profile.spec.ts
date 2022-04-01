import { expect } from '@playwright/test';
import test from '../../../../fixtures/next';

import ActivistTag from '../../../../mockData/orgs/KPD/tags/Activist';
import ClaraZetkin from '../../../../mockData/orgs/KPD/people/ClaraZetkin';
import CodingSkillsTag from '../../../../mockData/orgs/KPD/tags/Coding';
import KPD from '../../../../mockData/orgs/KPD';
import OrganizerTag from '../../../../mockData/orgs/KPD/tags/Organizer';
import PlaysGuitarTag from '../../../../mockData/orgs/KPD/tags/PlaysGuitar';

test.describe('Person Profile Page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
    moxy.setZetkinApiMock(
      `/orgs/1/people/${ClaraZetkin.id}`,
      'get',
      ClaraZetkin
    );
  });

  test.describe('Tags', () => {
    test('lists tags', async ({ page, appUri, moxy }) => {
      moxy.setZetkinApiMock('/orgs/1/people/tags', 'get', [
        ActivistTag,
        CodingSkillsTag,
        OrganizerTag,
        PlaysGuitarTag,
      ]);
      moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
        ActivistTag,
        CodingSkillsTag,
        OrganizerTag,
        PlaysGuitarTag,
      ]);

      await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

      expect(
        await page.locator(`text="${ActivistTag.title}"`).isVisible()
      ).toBeTruthy();
      expect(
        await page.locator(`text="${OrganizerTag.title}"`).isVisible()
      ).toBeTruthy();
      expect(
        await page.locator(`text="${CodingSkillsTag.title}"`).isVisible()
      ).toBeTruthy();
      expect(
        await page.locator(`text="${PlaysGuitarTag.title}"`).isVisible()
      ).toBeTruthy();
    });
    test.describe('adding tags', () => {
      test('can add tag to person', async ({ page, appUri, moxy }) => {
        moxy.setZetkinApiMock('/orgs/1/people/tags', 'get', [
          ActivistTag,
          CodingSkillsTag,
        ]);
        moxy.setZetkinApiMock(
          `/orgs/1/people/${ClaraZetkin.id}/tags`,
          'get',
          []
        );
        const { log: putTagLog } = moxy.setZetkinApiMock(
          '/orgs/1/people/1/tags/1',
          'put'
        );

        await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

        await page.locator('text=Add tag').click();
        await page
          .locator('data-testid=TagsManager-tagSelectTextField')
          .click();

        moxy.setZetkinApiMock(`/orgs/1/people/${ClaraZetkin.id}/tags`, 'get', [
          ActivistTag,
        ]);

        // Select tag
        await page.click('text=Activist');

        // Expect to have made request to put tag
        expect(putTagLog().length).toEqual(1);
      });

      test('shows error when adding tag fails', async ({
        moxy,
        page,
        appUri,
      }) => {
        moxy.setZetkinApiMock('/orgs/1/people/tags', 'get', [
          ActivistTag,
          CodingSkillsTag,
        ]);
        moxy.setZetkinApiMock(
          `/orgs/1/people/${ClaraZetkin.id}/tags`,
          'get',
          []
        );
        moxy.setZetkinApiMock('/orgs/1/people/1/tags/1', 'put', undefined, 401);

        await page.goto(appUri + `/organize/1/people/${ClaraZetkin.id}`);

        await page.locator('text=Add tag').click();
        await page
          .locator('data-testid=TagsManager-tagSelectTextField')
          .click();

        // Select tag
        await page.click('text=Activist');

        // Show error
        expect(
          await page.locator('data-testid=Snackbar-error').count()
        ).toEqual(1);
      });
    });
  });
});
