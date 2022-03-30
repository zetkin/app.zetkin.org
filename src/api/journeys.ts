import { GridColDef } from '@mui/x-data-grid-pro';

import { ColumnNames } from 'components/journeys/JourneyInstancesDataTable/getColumns';
import { ScaffoldedContext } from 'utils/next';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

import MarxistTraining from '../../playwright/mockData/orgs/KPD/journeys/MarxistTraining';

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
      dynamicColumns: GridColDef[];
      journeyInstances: ZetkinJourneyInstance[];
    }>(key, url),
  };
};
