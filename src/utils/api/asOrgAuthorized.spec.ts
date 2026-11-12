/** @jest-environment node */

import { describe, expect, it, jest } from '@jest/globals';

import IApiClient from 'core/api/client/IApiClient';
import mockApiClient from 'utils/testing/mocks/mockApiClient';
import { ZetkinMembership, ZetkinUser } from 'utils/types/zetkin';
import asOrgAuthorized, {
  AuthParams,
  GuardedFnProps,
} from 'utils/api/asOrgAuthorized';
import { ApiClientError } from 'core/api/errors';

const MockUser: ZetkinUser = {
  email: 'rosa@zetkin.org',
  email_is_verified: true,
  first_name: 'Rosa',
  id: 1,
  is_verified: true,
  lang: null,
  last_name: 'Luxemburg',
  phone: null,
  phone_is_verified: false,
  username: 'red_rosa',
};

const MockSuperuser: ZetkinUser = {
  ...MockUser,
  id: 2,
  is_superuser: true,
};

const MockOrgId = 1;

const MockMembership: ZetkinMembership = {
  organization: {
    id: MockOrgId,
    title: 'KPD',
  },
  profile: {
    id: 1,
    name: `${MockUser.first_name} ${MockUser.last_name}`,
  },
  role: 'null',
};

const MockAdmin: ZetkinMembership = {
  ...MockMembership,
  role: 'admin',
};

const MockOrganizer: ZetkinMembership = {
  ...MockMembership,
  role: 'organizer',
};

const MockRequest: Request = new Request('https://example.com/api/users', {
  headers: {
    Authorization: 'Bearer test-token',
    'Content-Type': 'application/json',
  },
  method: 'GET',
});

const localMockApiClient = (
  user: ZetkinUser,
  membership: ZetkinMembership | null
) => {
  return mockApiClient({
    get: jest
      .fn<IApiClient['get']>()
      .mockImplementation(async <DataType>(path: string): Promise<DataType> => {
        if (/^\/api\/users\/me\/memberships\/[0-9]+$/.test(path)) {
          return membership as DataType;
        }
        if (path === '/api/users/me') {
          return user as DataType;
        }
        throw new Error(`Unexpected API path: ${path}`);
      }),
  });
};

const asOrgAuthorizedReturnValue = async (
  authParams: AuthParams,
  apiClient: IApiClient
): Promise<GuardedFnProps> => {
  let props: GuardedFnProps | null = null;
  const response = await asOrgAuthorized(
    authParams,
    async (incomingProps) => {
      props = incomingProps;
      return new Response('', {
        status: 200,
      });
    },
    apiClient
  );

  if (!response.ok) {
    throw await ApiClientError.fromResponse(response);
  }

  if (!props) {
    throw new Error('Props never got set');
  }

  return props;
};

describe('asOrgAuthorized()', () => {
  it('Authorizes superusers with correct role', async () => {
    const apiClient = localMockApiClient(MockSuperuser, MockOrganizer);
    const result = await asOrgAuthorizedReturnValue(
      {
        orgId: MockOrgId,
        request: MockRequest,
        roles: ['organizer', 'admin'],
      },
      apiClient
    );
    expect(result.orgId).toBe(MockOrgId);
    expect(result.role).toBe('organizer');
  });

  it('Authorizes superusers without correct role', async () => {
    const apiClient = localMockApiClient(MockSuperuser, MockOrganizer);
    const result = await asOrgAuthorizedReturnValue(
      {
        orgId: MockOrgId,
        request: MockRequest,
        roles: ['admin'],
      },
      apiClient
    );
    expect(result.orgId).toBe(MockOrgId);
    expect(result.role).toBe('admin');
  });

  it('Authorizes superusers without any role', async () => {
    const apiClient = localMockApiClient(MockSuperuser, null);
    const result = await asOrgAuthorizedReturnValue(
      {
        orgId: MockOrgId,
        request: MockRequest,
        roles: ['admin'],
      },
      apiClient
    );
    expect(result.orgId).toBe(MockOrgId);
    expect(result.role).toBe('admin');
  });

  it('Authorizes users with correct role', async () => {
    const apiClient = localMockApiClient(MockUser, MockAdmin);
    const result = await asOrgAuthorizedReturnValue(
      {
        orgId: MockOrgId,
        request: MockRequest,
        roles: ['admin'],
      },
      apiClient
    );
    expect(result.orgId).toBe(MockOrgId);
    expect(result.role).toBe('admin');
  });

  it('Rejects users without correct role', async () => {
    const apiClient = localMockApiClient(MockUser, MockMembership);

    await expect(
      asOrgAuthorizedReturnValue(
        {
          orgId: MockOrgId,
          request: MockRequest,
          roles: ['admin'],
        },
        apiClient
      )
    ).rejects.toThrow(ApiClientError);
  });

  it('Rejects users without any membership', async () => {
    const apiClient = localMockApiClient(MockUser, null);

    await expect(
      asOrgAuthorizedReturnValue(
        {
          orgId: MockOrgId,
          request: MockRequest,
          roles: ['admin'],
        },
        apiClient
      )
    ).rejects.toThrow(ApiClientError);
  });
});
