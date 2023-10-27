import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import {
  getTagColumns,
  JourneyTagColumnData,
} from '../utils/journeyInstanceUtils';
import { journeyInstancesLoad, journeyInstancesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface JourneyInstancesData {
  journeyInstances: ZetkinJourneyInstance[];
  tagColumnsData: JourneyTagColumnData[];
}

export default function useJourneyInstances(
  orgId: number,
  journeyId: number
): IFuture<JourneyInstancesData> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const journeyInstanceList = useAppSelector(
    (state) => state.journeys.journeyInstanceList
  );

  const journeyInstancesFuture = loadListIfNecessary(
    journeyInstanceList,
    dispatch,
    {
      actionOnLoad: () => journeyInstancesLoad(),
      actionOnSuccess: (data) => journeyInstancesLoaded(data),
      loader: () =>
        apiClient.get<ZetkinJourneyInstance[]>(
          `/api/orgs/${orgId}/journeys/${journeyId}/instances`
        ),
    }
  );

  if (journeyInstancesFuture.isLoading) {
    return new LoadingFuture();
  } else if (journeyInstancesFuture.error) {
    return new ErrorFuture('Error loading journey instances.');
  }

  const journeyInstances = journeyInstancesFuture.data || [];
  const tagColumnsData = getTagColumns(journeyInstances);

  return new ResolvedFuture({ journeyInstances, tagColumnsData });
}
