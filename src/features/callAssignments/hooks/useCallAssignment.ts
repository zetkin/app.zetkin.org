import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import { ZetkinQuery } from 'utils/types/zetkin';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
  statsLoad,
  statsLoaded,
} from '../store';
import {
  IFuture,
  PlaceholderFuture,
  PromiseFuture,
  RemoteItemFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useSelector, useStore } from 'react-redux';

interface UseCallAssignmentReturn {
  allocated?: number;
  allTargets?: number;
  blocked?: number;
  callBackLater?: number;
  calledTooRecently?: number;
  cooldown?: number;
  disableCallerNotes?: boolean;
  done?: number;
  exposeTargetDetails?: boolean;
  goal?: ZetkinQuery;
  hasTargets: boolean;
  isTargeted: boolean;
  missingPhoneNumber?: number;
  organizerActionNeeded?: number;
  queue?: number;
  ready?: number;
  setCallerNotesEnabled: (enabled: boolean) => void;
  setCooldown: (cooldown: number) => void;
  setGoal: (query: Partial<ZetkinQuery>) => void;
  setTargetDetailsExposed: (targetDetailsExposed: boolean) => void;
  setTargets: (query: Partial<ZetkinQuery>) => void;
  statusBarStatsList: { color: string; value: number }[];
  target?: ZetkinQuery;
  title: string;
}

export default function useCallAssignment(
  orgId: number,
  assignmentId: number
): UseCallAssignmentReturn {
  const store = useStore<RootState>();
  const apiClient = useApiClient();
  const callAssignmentSlice = useSelector(
    (state: RootState) => state.callAssignments
  );
  const callAssignmentItems = callAssignmentSlice.assignmentList.items;
  const statsById = callAssignmentSlice.statsById;

  const getData = (): IFuture<CallAssignmentData> => {
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);

    if (!caItem || shouldLoad(caItem)) {
      store.dispatch(callAssignmentLoad(assignmentId));
      const promise = apiClient
        .get<CallAssignmentData>(
          `/api/orgs/${orgId}/call_assignments/${assignmentId}`
        )
        .then((data: CallAssignmentData) => {
          store.dispatch(callAssignmentLoaded(data));
          return data;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(caItem);
    }
  };

  const isTargeted = () => {
    const { data } = getData();
    return !!(data && data.target?.filter_spec?.length != 0);
  };

  const hasTargets = () => {
    const { data } = getStats();
    if (data === null) {
      return false;
    }
    return data.blocked + data.ready > 0;
  };

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
    if (!isTargeted()) {
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

  const setTargets = (query: Partial<ZetkinQuery>): void => {
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);
    const callAssignment = caItem?.data;

    if (callAssignment) {
      store.dispatch(callAssignmentUpdate([assignmentId, ['target']]));
      fetch(`/api/orgs/${orgId}/people/queries/${callAssignment.target.id}`, {
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) => {
          store.dispatch(
            callAssignmentUpdated([
              { ...callAssignment, target: data.data },
              ['target'],
            ])
          );
        });
    }
  };

  const setGoal = (query: Partial<ZetkinQuery>): void => {
    // TODO: Refactor once SmartSearch is supported in redux framework
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);
    const callAssignment = caItem?.data;

    if (callAssignment) {
      store.dispatch(callAssignmentUpdate([assignmentId, ['goal']]));
      fetch(`/api/orgs/${orgId}/people/queries/${callAssignment.goal.id}`, {
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) =>
          store.dispatch(
            callAssignmentUpdated([
              { ...callAssignment, goal: data.data },
              ['goal'],
            ])
          )
        );
    }
  };

  const updateCallAssignment = (
    data: Partial<CallAssignmentData>
  ): IFuture<CallAssignmentData> => {
    const mutatingAttributes = Object.keys(data);

    store.dispatch(callAssignmentUpdate([assignmentId, mutatingAttributes]));
    const promise = apiClient
      .patch<CallAssignmentData>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}`,
        data
      )
      .then((data: CallAssignmentData) => {
        store.dispatch(callAssignmentUpdated([data, mutatingAttributes]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const setCooldown = (cooldown: number) => {
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);
    const callAssignment = caItem?.data;

    //if cooldown has not changed, do nothing.
    if (cooldown === callAssignment?.cooldown) {
      return;
    }

    updateCallAssignment({ cooldown });
  };

  const setCallerNotesEnabled = (enabled: boolean) => {
    updateCallAssignment({
      disable_caller_notes: !enabled,
    });
  };

  const setTargetDetailsExposed = (exposeTargetDetails: boolean) => {
    updateCallAssignment({
      expose_target_details: exposeTargetDetails,
    });
  };

  const getStatusBarStatsList = () => {
    const { data: stats } = getStats();
    const statusBarStatsList =
      hasTargets() && stats
        ? [
            {
              color: 'statusColors.orange',
              value: stats.blocked,
            },
            {
              color: 'statusColors.blue',
              value: stats.ready,
            },
            {
              color: 'statusColors.green',
              value: stats.done,
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
    disableCallerNotes: getData().data?.disable_caller_notes,
    exposeTargetDetails: getData().data?.expose_target_details,
    ...getStats().data,
    goal: getData().data?.goal,
    hasTargets: hasTargets(),
    isTargeted: isTargeted(),
    setCallerNotesEnabled,
    setCooldown,
    setGoal,
    setTargetDetailsExposed,
    setTargets,
    statusBarStatsList: getStatusBarStatsList(),
    target: getData().data?.target,
    title: getData().data?.title || '',
  };
}
