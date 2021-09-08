/* eslint-disable sort-keys */
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

interface NextTestFixtures {
    login: () => Promise<void>;
}

interface NextWorkerFixtures {
    next: {
        appUri: string;
        moxy: {
            removeMock: (method?: MoxyHTTPMethod, path?: string) => Promise<void>;
            setMock: <G>(method: MoxyHTTPMethod, path: string, response?: Mock<G>) => Promise<void>;
        };
    };
}

const test = base.extend<NextTestFixtures, NextWorkerFixtures>({
    next: [ // Start a next server which serves the application, exposing the port to the tests
        async ({}, use, workerInfo) => {
            /**
             * Setup Moxy
             */
            const PROXY_FORWARD_URI = 'http://api.dev.zetkin.org';
            const MOXY_PORT = 30000 - workerInfo.workerIndex;

            const { start: startMoxy, stop: stopMoxy } = moxy({ forward: PROXY_FORWARD_URI, port: MOXY_PORT });
            startMoxy();

            const setMock = async <G>(method: MoxyHTTPMethod, path: string, response?: Mock<G>) => {
                const url = `http://localhost:${MOXY_PORT}${path}/_mocks/${method}`;

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
                    `http://localhost:${MOXY_PORT}${path}/_mocks/${method}` : // If path and method, remove specific mock
                    path != null ?
                        `http://localhost:${MOXY_PORT}${path}/_mocks` : // If no method, remove all on path
                        `http://localhost:${MOXY_PORT}$/_mocks/`; // If method and path, remove specific one

                await fetch(url, {
                    method: 'DELETE',
                });
            };

            /**
             * Setup Next App
             */
            const app = next({
                dev: false,
                dir: path.resolve(__dirname, '../..'), // Find production build
                conf: {
                    env: {
                        ZETKIN_API_PORT: MOXY_PORT.toString(),
                    },
                },
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
            const NEXT_PORT = String((server.address() as AddressInfo).port);

            await use({
                appUri: `http://localhost:${NEXT_PORT}`,
                moxy: {
                    setMock,
                    removeMock,
                },
            });

            // Close server when worker stops
            await new Promise(cb => {
                server.close(cb);
                stopMoxy();
            });

        },
        {
            auto: true,
            scope: 'worker',
        },
    ],
    // login: async ({ context, appUri }, use) => {
    //     const login = async () => {
    //         const page = await context.newPage();
    //         await page.goto(appUri + '/login');

    //         await page.fill('.LoginForm-emailInput', 'testadmin@example.com');
    //         await page.fill('.LoginForm-passwordInput', 'password');
    //         page.waitForTimeout(10000);

    //         await page.click('.LoginForm-submitButton');


    //         await context.storageState({ path: 'auth-state.json' });



    //         // await page.fill('.LoginForm-emailInput', 'testadmin@example.com');
    //         // await page.fill('.LoginForm-passwordInput', 'password');
    //         // await page.click('.LoginForm-submitButton');

    //     };

    //     await use(login);
    // },
});

export default test;
