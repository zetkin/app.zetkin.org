import { ColumnNames } from 'components/journeys/JourneyInstancesDataTable/getColumns';
import { ScaffoldedContext } from 'utils/next';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

import ClarasOnboarding from '../../playwright/mockData/orgs/KPD/journeys/instances/ClarasOnboarding';
import MarxistTraining from '../../playwright/mockData/orgs/KPD/journeys/MarxistTraining';
import { TagMetadata } from '../pages/api/organize/[orgId]/journeys/[journeyId]/getTagMetadata';

export const journeysResource = (orgId: string) => {
  const key = ['journeys', orgId];
  const url = `/orgs/${orgId}/journeys`;

  return {
    prefetch: createPrefetch<ZetkinJourney[]>(key, url),
    useQuery: createUseQuery<ZetkinJourney[]>(key, url),
  };
};

// TODO: delete dummy data
export const journeyResource = (orgId: string, journeyId: string) => {
  const key = ['journey', orgId, journeyId];
  const url = `/orgs/${orgId}/journeys/${journeyId}`;

  return {
    // prefetch: createPrefetch<ZetkinJourney>(key, url),
    prefetch: async (ctx?: ScaffoldedContext) => ({
      ctx,
      state: { status: 'success' },
    }),
    // useQuery: createUseQuery<ZetkinJourney>(key, url),
    useQuery: () => ({ data: MarxistTraining, key, url }),
  };
};

export const journeyInstancesResource = (orgId: string, journeyId: string) => {
  const key = ['journeyInstances', orgId, journeyId];
  const url = `/organize/${orgId}/journeys/${journeyId}`;

  return {
    useQuery: createUseQuery<{
      columnNames: ColumnNames;
      journeyInstances: ZetkinJourneyInstance[];
      tagMetadata: TagMetadata;
    }>(key, url),
  };
};

//TODO: update type when dummy data is removed
interface JourneyInstanceResource {
  prefetch: (ctx?: ScaffoldedContext | undefined) => Promise<{
    ctx: ScaffoldedContext | undefined;
    state: { status: string };
  }>;
  useQuery: () => { data: ZetkinJourneyInstance; key: unknown; url: string };
}

//TODO: remove dummy data
export const journeyInstanceResource = (
  orgId: string,
  journeyId: string,
  instanceId: string
): JourneyInstanceResource => {
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
  };
};
