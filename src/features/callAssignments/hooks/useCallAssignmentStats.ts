import { CallAssignmentStats } from '../apiTypes';
import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import useCallAssignment from './useCallAssignment';
import {
  IFuture,
  PlaceholderFuture,
  PromiseFuture,
  RemoteItemFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { statsLoad, statsLoaded } from '../store';
import { useSelector, useStore } from 'react-redux';

interface UseCallAssignmentStatsReturn {
  data: CallAssignmentStats | null;
  error: unknown | null;
  isLoading: boolean;
  statusBarStatsList: { color: string; value: number }[];
}

export default function useCallAssignmentStats(
  orgId: number,
  assignmentId: number
): UseCallAssignmentStatsReturn {
  const store = useStore<RootState>();
  const apiClient = useApiClient();
  const callAssignmentSlice = useSelector(
    (state: RootState) => state.callAssignments
  );
  const statsById = callAssignmentSlice.statsById;
  const { isTargeted } = useCallAssignment(orgId, assignmentId);

  const getCallAssignmentStats = () => {
    const statsItem = statsById[assignmentId];

    if (shouldLoad(statsItem)) {
      store.dispatch(statsLoad(assignmentId));
      const promise = apiClient
        .get<CallAssignmentStats>(
          `/api/callAssignments/targets?org=${orgId}&assignment=${assignmentId}`
        )
        .then((data: CallAssignmentStats) => {
          store.dispatch(statsLoaded({ ...data, id: assignmentId }));
          return data;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(statsItem);
    }
  };

  const getStats = (): IFuture<CallAssignmentStats | null> => {
    if (!isTargeted) {
      return new ResolvedFuture(null);
    }

    const future = getCallAssignmentStats();
    if (future.isLoading && !future.data) {
      return new PlaceholderFuture({
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        callsMade: 0,
        done: 0,
        id: assignmentId,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 0,
      });
    } else {
      return future;
    }
  };

  const getStatusBarStatsList = () => {
    const { data } = getStats();
    const hasTargets = data && data?.blocked + data?.ready > 0;
    const statusBarStatsList =
      hasTargets && data
        ? [
            {
              color: 'statusColors.orange',
              value: data.blocked,
            },
            {
              color: 'statusColors.blue',
              value: data.ready,
            },
            {
              color: 'statusColors.green',
              value: data.done,
            },
          ]
        : [
            {
              color: 'statusColors.gray',
              value: 1,
            },
            {
              color: 'statusColors.gray',
              value: 1,
            },
            {
              color: 'statusColors.gray',
              value: 1,
            },
          ];

    return statusBarStatsList;
  };

  return {
    ...getStats(),
    statusBarStatsList: getStatusBarStatsList(),
  };
}
