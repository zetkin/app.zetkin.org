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

import RosaLuxemburg from '../mockData/users/RosaLuxemburg';
import {
    LoggedRequestsRes,
    Mock,
    MoxyHTTPMethod,
    ZetkinAPIResponse,
} from '../types';
import { ZetkinSession, ZetkinUser } from '../../src/types/zetkin';

interface NextTestFixtures {
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

interface NextWorkerFixtures {
    appUri: string;
    moxy: {
        clearLog: () => Promise<void>;
        logRequests: <ReqData = unknown, ResData = unknown>(path?: string) => Promise<LoggedRequestsRes<ReqData, ResData>>;
        port: number;
        removeMock: (path?: string, method?: MoxyHTTPMethod, ) => Promise<void>;
        setMock: <G>(path: string, method: MoxyHTTPMethod, response?: Mock<G>) => Promise<() => Promise<void>>;
    };
}

const test = base.extend<NextTestFixtures, NextWorkerFixtures>({
    appUri: [
        async ({ moxy }, use) => {
            process.env.ZETKIN_API_PORT= moxy.port.toString();

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
            const NEXT_PORT = String((server.address() as AddressInfo).port);
            process.env.ZETKIN_APP_HOST = `localhost:${NEXT_PORT}`;

            await use(`http://localhost:${NEXT_PORT}`);

            // Close server when worker stops
            await new Promise(cb => {
                server.close(cb);
            });

        },
        {
            auto: true,
            scope: 'worker',
        },
    ],
    moxy: [async ({}, use, workerInfo) => {
        const PROXY_FORWARD_URI = 'http://api.dev.zetkin.org';
        const MOXY_PORT = 3000 + workerInfo.workerIndex;
        const URL_BASE = `http://localhost:${MOXY_PORT}/v1`;

        const { start: startMoxy, stop: stopMoxy } = moxy({ forward: PROXY_FORWARD_URI, port: MOXY_PORT });

        startMoxy();

        const setMock = async <G>(path: string, method: MoxyHTTPMethod, response?: Mock<G>) => {
            const url = `${URL_BASE}${path}/_mocks/${method}`;

            const res = await fetch(url, {
                body: JSON.stringify({ response }),
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                method: 'PUT',
            });

            if (res.status === 409) {
                throw Error(`
                     Mock already exists with method ${method} at path ${path}.
                     You must delete it with removeMock before you can assign a new mock with these parameters
                 `);
            }

            // Return function which removes the mock
            return async () => {
                removeMock(path, method);
            };
        };

        const removeMock = async(path?: string, method?: MoxyHTTPMethod) => {
            let url = `http://localhost:${MOXY_PORT}/_mocks`; // Remove all mocks
            // Remove all mocks on path
            if (path && !method) {
                url = `${URL_BASE}${path}/_mocks`;
            }
            // Remove mock from path and method
            if (path && method) {
                url = `${URL_BASE}${path}/_mocks/${method}`;
            }
            await fetch(url, {
                method: 'DELETE',
            });
        };

        const logRequests = async <ReqData, ResData>(path?: string) => {
            let url = `http://localhost:${MOXY_PORT}/_log`; // Log all mocks
            // Log all mocks on path
            if (path) {
                url = `${URL_BASE}${path}/_log`;
            }
            const res = await fetch(url, {
                method: 'GET',
            });
            const logs = await res.json() as Promise<LoggedRequestsRes<ReqData, ResData>>;
            return logs;
        };

        const clearLog = async() => {
            const url = `http://localhost:${MOXY_PORT}/_log`;
            await fetch(url, {
                method: 'DELETE',
            });
        };

        await use({
            clearLog,
            logRequests,
            port: MOXY_PORT,
            setMock,
            removeMock,
        });

        // Stop moxy when tests finish
        stopMoxy();

    }, {
        auto: true,
        scope: 'worker',
    }],
    login: async ({ moxy }, use) => {
        /**
         * Mocks the responses for getting the current user and the user session.
         *
         * The default user is Rosa Luxumburg. Pass in a ZetkinUser object to override.
         */
        const login = async (user: ZetkinUser = RosaLuxemburg) => {
            await moxy.setMock<ZetkinAPIResponse<ZetkinUser>>( '/users/me', 'get', {
                data: {
                    data: user,
                },
            });

            await moxy.setMock<ZetkinAPIResponse<ZetkinSession>>('/session', 'get', {
                data: {
                    data: {
                        created: '2020-01-01T00:00:00',
                        level: 2,
                        user: user,
                    },
                },
            });

        };
        await use(login);
    },
    logout: async({ moxy }, use) => {
        /**
         * Removes mock responses for getting the current user and session. Does not navigate user to log out,
         * this is only used for handling the mocks, which unauthenticates the user.
         */
        const logout = async () => {
            await moxy.removeMock('/users/me', 'get');
            await moxy.removeMock('/session', 'get');
        };
        await use(logout);
    },
});

export default test;
