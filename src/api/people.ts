/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createPrefetch,
  createUseMutation,
  createUseMutationDelete,
  createUseMutationPut,
  createUseQuery,
} from './utils/resourceHookFactories';

import { PersonOrganization } from 'utils/organize/people';
import { ZetkinPerson, ZetkinTag, ZetkinTagReqBody } from 'types/zetkin';

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

  return {
    useAdd: createUseMutationPut({ key, url }),
    useAvailableTagsQuery: createUseQuery<ZetkinTag[]>(
      ['tags', orgId],
      `/orgs/${orgId}/people/tags`
    ),
    useCreate: createUseMutation<ZetkinTagReqBody, ZetkinTag>(
      key,
      `/orgs/${orgId}/people/tags`
    ),
    useQuery: createUseQuery<ZetkinTag[]>(key, url),
    useRemove: createUseMutationDelete({ key, url }),
  };
};
