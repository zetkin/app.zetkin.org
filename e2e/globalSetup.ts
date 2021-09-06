/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */

import fs from 'fs';
import { nextBuild } from 'next/dist/cli/next-build';
import path from 'path';

async function globalSetup() {
    // @ts-ignore
    process.env.NODE_ENV = 'production';
    process.env.PLAYWRIGHT = '1';

    // Copy env file .env.test to .env.production
    fs.copyFile(path.join(__dirname, '..', '.env.test'), path.join(__dirname, '..', '.env.production'), (err) => {
        if (err) {
            console.error('Error copying env.test to env.production');
            throw err;
        }
    });

    // Skip build if flag is set to 1
    if (process.env.SKIP_BUILD === '1') {
        console.log('skipping build: SKIP_BUILD is set');
    }
    else {
        await nextBuild([path.join(__dirname, '..')]);
    }
}

module.exports = globalSetup;
