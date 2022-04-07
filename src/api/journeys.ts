/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

import { TagMetadata } from '../utils/getTagMetadata';

export const journeysResource = (orgId: string) => {
  const key = ['journeys', orgId];
  const url = `/orgs/${orgId}/journeys`;

  return {
    prefetch: createPrefetch<ZetkinJourney[]>(key, url),
    useQuery: createUseQuery<ZetkinJourney[]>(key, url),
  };
};

export const journeyResource = (orgId: string, journeyId: string) => {
  const key = ['journey', orgId, journeyId];
  const url = `/orgs/${orgId}/journeys/${journeyId}`;

  return {
    prefetch: createPrefetch<ZetkinJourney>(key, url),
    useQuery: createUseQuery<ZetkinJourney>(key, url),
  };
};

export const journeyInstancesResource = (orgId: string, journeyId: string) => {
  const key = ['journeyInstances', orgId, journeyId];
  const url = `/organize/${orgId}/journeys/${journeyId}`;

  return {
    useQuery: createUseQuery<{
      journeyInstances: ZetkinJourneyInstance[];
      tagMetadata: TagMetadata;
    }>(key, url),
  };
};
