import { activeEventsLoad, activeEventsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinEventWithStatus } from 'features/home/types';

export default function useActiveEvents(
  orgId: number,
  targetId: number
): ZetkinEvent[] {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.call.eventsByTargetId[targetId]);

  const todaysDate = new Date().toISOString().split('T')[0];

  return useRemoteList(list, {
    actionOnLoad: () => activeEventsLoad(targetId),
    actionOnSuccess: (data) => activeEventsLoaded([targetId, data]),
    loader: () => {
      const filterParam = encodeURIComponent(`start_time>${todaysDate}`);
      const url = `/api/orgs/${orgId}/actions?filter=${filterParam}`;
      return apiClient.get<ZetkinEventWithStatus[]>(url);
    },
  });
}
