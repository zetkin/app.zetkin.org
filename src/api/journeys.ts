/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ScaffoldedContext } from 'utils/next';

import ClarasOnboarding from '../../playwright/mockData/orgs/KPD/journeys/instances/ClarasOnboarding';
import { TagMetadata } from '../utils/getTagMetadata';
import {
  createPrefetch,
  createUseMutation,
  createUseQuery,
} from './utils/resourceHookFactories';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

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

//TODO: remove dummy data
export const journeyInstanceResource = (
  orgId: string,
  journeyId: string,
  instanceId: string
) => {
  const key = ['journeyInstance', orgId, journeyId, instanceId];
  const url = `/organize/${orgId}/journeys/${journeyId}/instances/${instanceId}`;

  return {
    //prefetch: createPrefetch<ZetkinJourneyInstance>(key,url),
    prefetch: async (ctx?: ScaffoldedContext) => ({
      ctx,
      state: { status: 'success' },
    }),
    //useQuery: createUseQuery<ZetkinJourneyInstance>(key, url),
    useQuery: () => ({ data: ClarasOnboarding, key, url }),
    useUpdate: createUseMutation<
      Partial<ZetkinJourneyInstance>,
      ZetkinJourneyInstance
    >(key, url, {
      method: 'PATCH',
    }),
  };
};
