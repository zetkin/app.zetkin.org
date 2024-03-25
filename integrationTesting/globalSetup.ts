/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */

import { copyFile } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';

const execPromisified = util.promisify(exec);

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
    const { stderr } = await execPromisified('next build', {
      cwd: path.join(__dirname, '..'),
    });
    if (stderr) {
      console.error(`exec error: ${stderr}`);
    }
  }
}

module.exports = globalSetup;
