import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import {
  personJourneyInstancesLoad,
  personJourneyInstancesLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePersonJourneyInstances(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const instancesList = useAppSelector(
    (state) => state.journeys.journeyInstancesBySubjectId[personId]
  );

  return loadListIfNecessary(instancesList, dispatch, {
    actionOnLoad: () => personJourneyInstancesLoad(personId),
    actionOnSuccess: (instances) =>
      personJourneyInstancesLoaded([personId, instances]),
    loader: () =>
      apiClient.get<ZetkinJourneyInstance[]>(
        `/api/orgs/${orgId}/people/${personId}/journey_instances`
      ),
  });
}
