/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createPrefetch,
  createUseMutationDelete,
  createUseMutationPut,
  createUseQuery,
} from './utils/resourceHookFactories';

import APIError from 'utils/apiError';
import { defaultFetch } from 'fetching';
import { makeUseMutationOptions } from './utils/makeUseMutationOptions';
import { PersonOrganization } from 'utils/organize/people';
import { useMutation, useQueryClient } from 'react-query';
import { ZetkinPerson, ZetkinTag } from 'types/zetkin';

export const personResource = (orgId: string, personId: string) => {
  const key = ['person', personId];
  const url = `/orgs/${orgId}/people/${personId}`;

  return {
    prefetch: createPrefetch<ZetkinPerson>(key, url),
    useQuery: createUseQuery<ZetkinPerson>(key, url),
    useRemove: createUseMutationDelete({ key, url }),
  };
};

export const personOrganizationsResource = (
  orgId: string,
  personId: string
) => {
  const key = ['personOrganizations', personId];
  const orgsUrl = `/organize/${orgId}/people/${personId}/organizations`;
  const connectionsUrl = `/orgs/${orgId}/people/${personId}/connections`;

  return {
    useAdd: createUseMutationPut({ key, url: connectionsUrl }),
    useQuery: createUseQuery<{
      memberships: PersonOrganization[];
      organizationTree: PersonOrganization;
      personOrganizationTree: PersonOrganization;
      subOrganizations: PersonOrganization[];
    }>(key, orgsUrl),
    useRemove: createUseMutationDelete({ key, url: connectionsUrl }),
  };
};

export const personTagsResource = (orgId: string, personId: string) => {
  const key = ['personTags', personId];
  const url = `/orgs/${orgId}/people/${personId}/tags`;

  const handler = async (
    resource: Pick<ZetkinTag, 'id' | 'value'>
  ): Promise<null> => {
    const { id, value } = resource;
    const res = await defaultFetch(`${url}/${id}`, {
      body: JSON.stringify({ value }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });

    if (!res.ok) {
      throw new APIError('PUT', res.url);
    }
    return null;
  };

  return {
    key,
    useAssign: () => {
      const queryClient = useQueryClient();
      return useMutation(handler, makeUseMutationOptions(queryClient, key));
    },
    useQuery: createUseQuery<ZetkinTag[]>(key, url),
    useUnassign: createUseMutationDelete({ key, url }),
  };
};
