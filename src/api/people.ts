/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';

import { ZetkinPerson } from '../types/zetkin';

export const personResource = (orgId: string, personId: string) => {
  const key = ['person', personId];
  const url = `/orgs/${orgId}/people/${personId}`;

  return {
    prefetch: createPrefetch<ZetkinPerson>(key, url),
    useQuery: createUseQuery<ZetkinPerson>(key, url),
  };
};
