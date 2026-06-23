import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import shouldLoad from 'core/caching/shouldLoad';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { RemoteItem } from 'utils/storeUtils';
import { eventsByOrgLoad, eventsByOrgLoaded } from '../store';

export default function useEventsByOrgs(
  orgIds: number[]
): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const events = useAppSelector((state) => state.smartSearch);
  const dispatch = useAppDispatch();

  const missingOrgIds = orgIds.filter((orgId) =>
    shouldLoad(events.eventsByOrgId[orgId])
  );
  const loadingOrgIds = orgIds.filter(
    (orgId) => events.eventsByOrgId[orgId]?.isLoading
  );

  if (missingOrgIds.length > 0) {
    missingOrgIds.forEach((orgId) => {
      dispatch(eventsByOrgLoad(orgId));
      apiClient
        .get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`)
        .then((items) => {
          dispatch(eventsByOrgLoaded([orgId, items]));
        });
    });
  }

  if (loadingOrgIds.length > 0 || missingOrgIds.length > 0) {
    return new LoadingFuture();
  } else {
    const zetkinEvents: ZetkinEvent[] = orgIds
      .flatMap(
        (orgId: number): RemoteItem<ZetkinEvent>[] =>
          events.eventsByOrgId[orgId].items
      )
      .map((item: RemoteItem<ZetkinEvent>): ZetkinEvent | null => item.data)
      .filter((data: ZetkinEvent | null): data is ZetkinEvent => !!data);

    return new ResolvedFuture(zetkinEvents);
  }
}
