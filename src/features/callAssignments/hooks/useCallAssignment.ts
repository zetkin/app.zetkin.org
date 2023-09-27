import { CallAssignmentData } from '../apiTypes';
import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import useCallAssignmentStats from './useCallAssignmentStats';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useSelector, useStore } from 'react-redux';
import { ZetkinCallAssignment, ZetkinQuery } from 'utils/types/zetkin';

interface UseCallAssignmentReturn {
  cooldown?: number;
  data: ZetkinCallAssignment | null;
  disableCallerNotes?: boolean;
  endDate?: string | null;
  exposeTargetDetails?: boolean;
  goal?: ZetkinQuery;
  hasTargets: boolean;
  instructions: string;
  isTargeted: boolean;
  setCallerNotesEnabled: (enabled: boolean) => void;
  setCooldown: (cooldown: number) => void;
  setGoal: (query: Partial<ZetkinQuery>) => void;
  setTargetDetailsExposed: (targetDetailsExposed: boolean) => void;
  setTargets: (query: Partial<ZetkinQuery>) => void;
  startDate?: string | null;
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
  const { data: statsData } = useCallAssignmentStats(orgId, assignmentId);

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
    if (statsData === null) {
      return false;
    }
    return statsData.blocked + statsData.ready > 0;
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

  const data = getData().data;

  return {
    cooldown: data?.cooldown,
    data,
    disableCallerNotes: data?.disable_caller_notes,
    endDate: data?.end_date,
    exposeTargetDetails: data?.expose_target_details,
    goal: data?.goal,
    hasTargets: hasTargets(),
    instructions: data?.instructions || '',
    isTargeted: isTargeted(),
    setCallerNotesEnabled,
    setCooldown,
    setGoal,
    setTargetDetailsExposed,
    setTargets,
    startDate: data?.start_date,
    target: data?.target,
    title: data?.title || '',
  };
}
