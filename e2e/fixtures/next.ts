/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty-pattern */

import { AddressInfo } from 'net';
import { test as base } from '@playwright/test';
// @ts-ignore
import fetch from 'node-fetch';
import moxy from 'moxy';
import next from 'next';
import { parse } from 'url';
import path from 'path';
import { createServer, Server } from 'http';

type MoxyHTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

interface Mock<G> {
    data?: G;
    headers?: Record<string, string>;
    status?: number;
}

interface NextWorkerFixtures {
    appUri: string;
    moxy: {
        removeMock: (method?: MoxyHTTPMethod, path?: string) => Promise<void>;
        setMock: <G>(method: MoxyHTTPMethod, path: string, response?: Mock<G>) => Promise<void>;
    };
}

const test = base.extend<Record<string, unknown>, NextWorkerFixtures>({
    appUri: [ // Start a next server which serves the application, exposing the port to the tests
        async ({}, use) => {
            const app = next({
                dev: false,
                dir: path.resolve(__dirname, '../..'), // Find production build
            });

            await app.prepare();
            const handle = app.getRequestHandler();

            // Start next server on arbitrary port
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

            // Get the port from the next server
            const port = String((server.address() as AddressInfo).port);

            await use(`http://localhost:${port}`);

            // Close server when worker stops
            await new Promise(cb => server.close(cb));
        },
        {
            auto: true,
            scope: 'worker',
        },
    ],
    moxy: [ // Start a moxy proxy on port 8001, exposing functions to set and remove mocks
        async ({}, use, workerInfo) => {
            const PROXY_FORWARD_URI = 'http://api.dev.zetkin.org';
            const PORT = 30000 - workerInfo.workerIndex;

            const { start, stop } = moxy({ forward: PROXY_FORWARD_URI, port: PORT });
            start();

            const setMock = async <G>(method: MoxyHTTPMethod, path: string, response?: Mock<G>) => {
                const url = `localhost:${PORT}${path}/_mocks/${method}`;

                const res = await fetch(url, {
                    body: JSON.stringify(response),
                    headers: [
                        ['Content-Type', 'application/json'],
                    ],
                    method: 'PUT',
                });

                if (res.status === 409) {
                    throw Error(`
                        Mock already exists with method ${method} at path ${path}. 
                        You must delete it before you can assign a new mock with these parameters
                    `);
                }
            };

            const removeMock = async(method?: MoxyHTTPMethod, path?: string) => {
                const url = method != null && path != null ?
                    `localhost:${PORT}${path}/_mocks/${method}` : // If path and method, remove specific mock
                    path != null ?
                        `localhost:${PORT}${path}/_mocks` : // If no method, remove all on path
                        `localhost:${PORT}$/_mocks/`; // If method and path, remove specific one

                await fetch(url, {
                    method: 'DELETE',
                });
            };

            await use({
                removeMock,
                setMock,
            });

            stop();
        },
        {
            auto: true,
            scope: 'worker',
        },
    ],
});

export default test;
