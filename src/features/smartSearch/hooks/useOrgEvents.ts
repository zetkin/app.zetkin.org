import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { IFuture } from 'core/caching/futures';
import { eventsByOrgLoad, eventsByOrgLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

export default function useOrgEvents(
  rootOrgId: number,
  recursive?: boolean
): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const events = useAppSelector((state) =>
    recursive
      ? state.smartSearch.recursiveEventsByOrgId[rootOrgId]
      : state.smartSearch.eventsByOrgId[rootOrgId]
  );
  const dispatch = useAppDispatch();

  let fetchUrl = `/api/orgs/${rootOrgId}/actions`;
  if (recursive) {
    fetchUrl += '?recursive';
  }

  return loadListIfNecessary(events, dispatch, {
    actionOnLoad: () => eventsByOrgLoad([rootOrgId, !!recursive]),
    actionOnSuccess: (events) =>
      eventsByOrgLoaded([rootOrgId, events, !!recursive]),
    loader: () => apiClient.get<ZetkinEvent[]>(fetchUrl),
  });
}
