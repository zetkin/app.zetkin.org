import { expect } from '@playwright/test';

import test from '../../fixtures/next';

test.afterEach(({ moxy }) => {
  moxy.teardown();
});

test('returns a local 404 for unmocked API requests', async ({
  moxy,
  request,
}) => {
  const response = await request.get(
    `http://localhost:${moxy.port}/v1/unmocked-test-resource`,
    { timeout: 5000 }
  );

  expect(response.status()).toBe(404);
  expect(moxy.log('/v1/unmocked-test-resource')[0].mocked).toBe(false);
});

test('serves and logs explicitly mocked API requests', async ({
  moxy,
  request,
}) => {
  const data = { id: 1 };
  const mock = moxy.setZetkinApiMock('/test-resource', 'get', data);

  const response = await request.get(
    `http://localhost:${moxy.port}/v1/test-resource`,
    { timeout: 5000 }
  );

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ data });
  expect(mock.log()).toHaveLength(1);
  expect(mock.log()[0].mocked).toBe(true);
});
