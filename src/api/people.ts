/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createPrefetch,
  createUseMutation,
  createUseQuery,
} from './utils/resourceHookFactories';

import { ZetkinMembership, ZetkinPerson } from '../types/zetkin';

export const personResource = (orgId: string, personId: string) => {
  const key = ['person', personId];
  const url = `/orgs/${orgId}/people/${personId}`;

  return {
    prefetch: createPrefetch<ZetkinPerson>(key, url),
    useQuery: createUseQuery<ZetkinPerson>(key, url),
    useUpdate: createUseMutation<Partial<ZetkinPerson>, ZetkinPerson>(
      key,
      url,
      {
        method: 'PATCH',
      }
    ),
  };
};

export const personConnectionsResource = (orgId: string, personId: string) => {
  const key = ['personConnections', personId];
  const url = `/orgs/${orgId}/people/${personId}/connections`;

  return {
    useQuery: createUseQuery<ZetkinMembership[]>(key, url),
  };
};
