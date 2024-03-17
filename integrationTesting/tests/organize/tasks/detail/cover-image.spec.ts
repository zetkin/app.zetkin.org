import { expect } from '@playwright/test';
import fs from 'fs/promises';

import test from '../../../../fixtures/next';

import KPD from '../../../../mockData/orgs/KPD';
import ReferendumSignatureCollection from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures';
import SpeakToFriend from '../../../../mockData/orgs/KPD/campaigns/ReferendumSignatures/tasks/SpeakToFriend';
import { ZetkinFile, ZetkinTask } from '../../../../../src/utils/types/zetkin';

test.describe('Task detail page', () => {
  test.beforeEach(({ login, moxy }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', SpeakToFriend);
    moxy.setZetkinApiMock(
      '/orgs/1/campaigns/1',
      'get',
      ReferendumSignatureCollection
    );
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('lets user upload cover image', async ({
    appUri,
    fileServerUri,
    moxy,
    page,
  }) => {
    const claraAndRosaFile: ZetkinFile = {
      id: 1,
      mime_type: 'image/jpg',
      organization: KPD,
      original_name: 'clara_and_rosa.jpg',
      uploaded: '1857-07-05T13:37:00.000',
      url: fileServerUri + '/clara_and_rosa.jpg',
    };

    const taskWithFile: ZetkinTask = {
      ...SpeakToFriend,
      cover_file: claraAndRosaFile,
    };

    moxy.setZetkinApiMock<ZetkinFile>(
      '/orgs/1/files',
      'post',
      claraAndRosaFile,
      201
    );

    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'patch', taskWithFile);

    await page.goto(appUri + '/organize/1/projects/1/calendar/tasks/1');

    await page.locator('data-testid=TaskPreviewSection-addImage').click();

    const buffer = await fs.readFile(
      'integrationTesting/mockFiles/clara_and_rosa.jpg'
    );
    const dataTransfer = await page.evaluateHandle((data) => {
      const dt = new DataTransfer();
      const file = new File([data as BlobPart], 'clara_and_rosa.jpg', {
        type: 'image/jpeg',
      });
      dt.items.add(file);
      return dt;
    }, buffer);

    await page.dispatchEvent('data-testid=ImageSelectDialog-dropZone', 'drop', {
      dataTransfer,
    });

    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', taskWithFile);

    await Promise.all([
      page.waitForRequest((req) => req.method() === 'PATCH'),
      page.waitForResponse((res) =>
        res.request().url().includes('clara_and_rosa.jpg')
      ),
      page.locator('data-testid=SubmitCancelButtons-submitButton').click(),
    ]);

    await page.locator('data-testid=TaskPreviewSection-section').waitFor();

    expect(
      await page
        .locator('data-testid=TaskPreviewSection-section >> img')
        .isVisible()
    ).toBeTruthy();
  });

  test('lets user reset cover image', async ({
    appUri,
    fileServerUri,
    moxy,
    page,
  }) => {
    const claraAndRosaFile: ZetkinFile = {
      id: 1,
      mime_type: 'image/jpg',
      organization: KPD,
      original_name: 'clara_and_rosa.jpg',
      uploaded: '1857-07-05T13:37:00.000',
      url: fileServerUri + '/clara_and_rosa.jpg',
    };

    const taskWithFile: ZetkinTask = {
      ...SpeakToFriend,
      cover_file: claraAndRosaFile,
    };

    moxy.setZetkinApiMock('/orgs/1/tasks/1', 'get', taskWithFile);
    const { log: patchLog } = moxy.setZetkinApiMock(
      '/orgs/1/tasks/1',
      'patch',
      SpeakToFriend
    );

    const image = page.locator('data-testid=TaskPreviewSection-section >> img');

    await page.goto(appUri + '/organize/1/projects/1/calendar/tasks/1');
    await image.waitFor({ state: 'visible' });

    await Promise.all([
      page.waitForResponse((res) => res.request().method() == 'PATCH'),
      page.locator('data-testid=ZetkinEditableImage-resetButton').click(),
    ]);

    expect(patchLog()[0].data).toEqual({
      cover_file_id: null,
    });
  });
});
