/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* Reason for above: the output types of these resources are cast
in the places where they are ultimately consumed */
import { ColumnNames } from 'components/journeys/JourneyInstancesDataTable/getColumns';
import { ScaffoldedContext } from 'utils/next';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

import MarxistTraining from '../../playwright/mockData/orgs/KPD/journeys/MarxistTraining';
import { TagMetadata } from '../utils/getTagMetadata';

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
