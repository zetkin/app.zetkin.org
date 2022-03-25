import { UseQueryResult } from 'react-query';

import { createUseQuery } from './utils/resourceHookFactories';
import { ZetkinJourney } from '../types/zetkin';

export const journeysResource = (
  orgId: string
): { useQuery: () => UseQueryResult<ZetkinJourney[], unknown> } => {
  const key = ['campaigns', orgId];
  const url = `/orgs/${orgId}/journeys`;

  return {
    useQuery: createUseQuery<ZetkinJourney[]>(key, url),
  };
};
