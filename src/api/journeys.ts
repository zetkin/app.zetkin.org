import { QueryState } from 'react-query/types/core/query';
import { UseQueryResult } from 'react-query';

import { ScaffoldedContext } from 'utils/next';
import { ZetkinJourney } from 'types/zetkin';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';

interface JourneysResources {
  useQuery: () => UseQueryResult<ZetkinJourney[], unknown>;
  prefetch: (scaffoldContext: ScaffoldedContext) => Promise<{
    data?: ZetkinJourney[] | undefined;
    state?: QueryState<ZetkinJourney[], unknown> | undefined;
  }>;
}

export const journeysResource = (orgId: string): JourneysResources => {
  const key = ['campaigns', orgId];
  const url = `/orgs/${orgId}/journeys`;

  return {
    prefetch: createPrefetch<ZetkinJourney[]>(key, url),
    useQuery: createUseQuery<ZetkinJourney[]>(key, url),
  };
};
