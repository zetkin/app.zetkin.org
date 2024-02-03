/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */

import { copyFile } from 'fs/promises';
import { nextBuild } from 'next/dist/cli/next-build';
import path from 'path';

async function globalSetup() {
  process.env.PLAYWRIGHT = '1';

  // Copy env file .env.test to .env.production
  await copyFile(
    path.join(__dirname, '..', '.env.test'),
    path.join(__dirname, '..', '.env.production')
  );

  // Skip build if flag is set to 1
  if (process.env.SKIP_BUILD === '1') {
    console.log('skipping build: SKIP_BUILD is set');
  } else {
    await nextBuild([path.join(__dirname, '..')]);
  }
}

module.exports = globalSetup;
