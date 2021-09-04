/* eslint-disable no-empty-pattern */

import { AddressInfo } from 'net';
import { test as base } from '@playwright/test';
import next from 'next';
import { parse } from 'url';
import path from 'path';
import { createServer, Server } from 'http';

interface NextWorkerFixtures {
    port: string;
}

const test = base.extend<Record<string, unknown>, NextWorkerFixtures>({
    port: [
        async ({}, use) => {
            const app = next({
                dev: false,
                dir: path.resolve(__dirname, '../..'), // find production build
            });

            await app.prepare();
            const handle = app.getRequestHandler();

            // start next server on arbitrary port
            const server: Server = await new Promise((resolve) => {

                const server = createServer((req, res) => {
                    const parsedUrl = parse(req.url as string, true);
                    handle(req, res, parsedUrl);
                });

                server.listen((error: unknown) => {
                    if (error) throw error;
                    resolve(server);
                });
            });
            // get the randomly assigned port from the server
            const port = String((server.address() as AddressInfo).port);
            // provide port to tests
            await use(port);
        },
        {
            scope: 'worker',
        },
    ],
});

export default test;
