/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty-pattern */

import { AddressInfo } from 'net';
import { test as base } from '@playwright/test';
import fs from 'fs/promises';
import http from 'http';
import next from 'next';
import { parse } from 'url';
import path from 'path';
import { createServer, Server } from 'http';
import moxy, {
  HTTPMethod,
  LoggedRequest,
  MockResponseSetter,
  Moxy,
} from 'moxy';

import Memberships from '../mockData/orgs/KPD/Memberships';
import RosaLuxemburgUser from '../mockData/users/RosaLuxemburgUser';
import {
  ZetkinMembership,
  ZetkinSession,
  ZetkinUser,
} from 'utils/types/zetkin';

interface NextTestFixtures {
  login: (user?: ZetkinUser, memberships?: ZetkinMembership[]) => void;
  logout: () => void;
  setBrowserDate: (date: Date) => Promise<void>;
}

export interface NextWorkerFixtures {
  appUri: string;
  fileServerUri: string;
  moxy: {
    port: number;
    setZetkinApiMock: <G>(
      path: string,
      method?: HTTPMethod,
      data?: G,
      status?: MockResponseSetter['status'],
      headers?: MockResponseSetter['headers']
    ) => {
      log: <T>() => LoggedRequest<T, { data: G }>[];
      removeMock: () => void;
    };
    teardown: () => void;
  } & Omit<Moxy, 'start' | 'stop'>;
}

const test = base.extend<NextTestFixtures, NextWorkerFixtures>({
  appUri: [
    async ({ moxy }, use) => {
      process.env.ZETKIN_API_PORT = moxy.port.toString();

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
          if (error) {
            throw error;
          }
          resolve(server);
        });
      });

      // Get the port from the next server
      const NEXT_PORT = String((server.address() as AddressInfo).port);
      process.env.ZETKIN_APP_HOST = `localhost:${NEXT_PORT}`;

      await use(`http://localhost:${NEXT_PORT}`);

      // Close server when worker stops
      await new Promise((cb) => {
        server.close(cb);
      });
    },
    {
      auto: true,
      scope: 'worker',
    },
  ],
  fileServerUri: [
    async ({}, use) => {
      const server = http.createServer(async (req, res) => {
        try {
          // This is not a secure file server, but it's a test fixture, so it's ok
          const filePath = path.join(__dirname, '../mockFiles', req.url!);
          const buf = await fs.readFile(filePath);
          res.writeHead(200);
          res.end(buf);
        } catch (err) {
          res.writeHead(404);
          res.end();
        }
      });

      const port = await new Promise((resolve, reject) => {
        server.listen((err: unknown) => {
          if (err) {
            reject(err);
          } else {
            resolve((server.address() as AddressInfo).port);
          }
        });
      });

      await use(`http://localhost:${port}`);

      server.close();
    },
    {
      auto: false,
      scope: 'worker',
    },
  ],
  moxy: [
    async ({}, use, workerInfo) => {
      const PROXY_FORWARD_URI = 'http://api.dev.zetkin.org';
      const MOXY_PORT = 3000 + workerInfo.workerIndex;

      const { start, stop, setMock, ...rest } = moxy({
        forward: PROXY_FORWARD_URI,
        port: MOXY_PORT,
      });

      /**
       * Wrapper around `moxy.setMock()` which sets the response body of the mock to be accessed in the `data`
       * property. This is to make it easier to emulate successful Zetkin API responses.
       */
      const setZetkinApiMock = <G>(
        path: string,
        method?: HTTPMethod,
        data?: G,
        status?: MockResponseSetter['status'],
        headers?: MockResponseSetter['headers']
      ) => {
        return setMock<{ data: G }>(`/v1${path}`, method, {
          status,
          headers,
          data: data
            ? {
                data,
              }
            : undefined,
        });
      };

      const teardown = () => {
        rest.clearLog();
        rest.removeMock();
      };

      start();

      await use({
        port: MOXY_PORT,
        setZetkinApiMock,
        setMock,
        teardown,
        ...rest,
      });

      // Stop moxy when tests finish
      await stop();
    },
    {
      auto: true,
      scope: 'worker',
    },
  ],
  login: async ({ moxy }, use) => {
    /**
     * Mocks the responses for getting the current user and the user session.
     *
     * The default user is Rosa Luxumburg. Pass in a ZetkinUser object to override.
     */
    const login = (
      user: ZetkinUser = RosaLuxemburgUser,
      memberships: ZetkinMembership[] = Memberships
    ) => {
      moxy.setZetkinApiMock<ZetkinUser>('/users/me', 'get', user);
      moxy.setZetkinApiMock<ZetkinMembership[]>(
        '/users/me/memberships',
        'get',
        memberships
      );

      moxy.setZetkinApiMock<ZetkinSession>('/session', 'get', {
        created: '2020-01-01T00:00:00',
        level: 2,
        user: user,
      });
    };
    await use(login);
  },
  logout: async ({ moxy }, use) => {
    /**
     * Removes mock responses for getting the current user and session. Does not navigate user to log out,
     * this is only used for handling the mocks, which unauthenticates the user.
     */
    const logout = () => {
      moxy.removeMock('/users/me', 'get');
      moxy.removeMock('/session', 'get');
      moxy.removeMock('/users/me/memberships', 'get');
    };
    await use(logout);
  },
  setBrowserDate: async ({ page }, use) => {
    const setBrowserDate = async (date: Date) => {
      // Pick the new/fake "now" for you test pages.
      const fakeNow = new Date(date).valueOf();

      // Update the Date accordingly in your test pages
      await page.addInitScript(`{
      // Extend Date constructor to default to fakeNow
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(${fakeNow});
          } else {
            super(...args);
          }
        }
      }
      // Override Date.now() to start from fakeNow
      const __DateNowOffset = ${fakeNow} - Date.now();
      const __DateNow = Date.now;
      Date.now = () => __DateNow() + __DateNowOffset;
    }`);
    };
    await use(setBrowserDate);
  },
});

export default test;
