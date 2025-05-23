import IApiClient from 'core/api/client/IApiClient';

type MockedApiClient = jest.Mocked<IApiClient>;

export default function mockApiClient(
  overrides?: Partial<MockedApiClient>
): MockedApiClient {
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
  };
}
