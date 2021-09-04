/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */

import { nextBuild } from 'next/dist/cli/next-build';
import path from 'path';

async function globalSetup() {
    // @ts-ignore
    process.env.NODE_ENV = 'production';
    process.env.PLAYWRIGHT = '1';

    if (process.env.SKIP_BUILD === '1') {
        console.log('skipping build: SKIP_BUILD is set');
    }
    else {
        await nextBuild([path.join(__dirname, '..')]);
    }
}

module.exports = globalSetup;
