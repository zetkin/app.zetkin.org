import { jest } from '@jest/globals';

import IApiClient from 'core/api/client/IApiClient';

type MockedApiClient = jest.Mocked<IApiClient>;

export default function mockApiClient(overrides?: {
  delete?: jest.Mock<IApiClient['delete']>;
  get?: jest.Mock<IApiClient['get']>;
  patch?: jest.Mock<IApiClient['patch']>;
  post?: jest.Mock<IApiClient['post']>;
  put?: jest.Mock<IApiClient['put']>;
  rpc?: jest.Mock<IApiClient['rpc']>;
}): MockedApiClient {
  const defaultApiClient = {
    delete: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    rpc: jest.fn(),
  };

  return {
    ...defaultApiClient,
    ...overrides,
  } as MockedApiClient;
}
