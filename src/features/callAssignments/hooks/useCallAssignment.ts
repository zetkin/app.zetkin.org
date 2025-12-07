import dayjs from 'dayjs';

import { CallAssignmentData, CallAssignmentPatchBody } from '../apiTypes';
import {
  callAssignmentDeleted,
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinCallAssignment, ZetkinQuery } from 'utils/types/zetkin';

interface UseCallAssignmentReturn {
  data: ZetkinCallAssignment | null;
  end: () => void;
  error: unknown | null;
  isTargeted: boolean;
  isLoading: boolean;
  updateGoal: (query: Partial<ZetkinQuery>) => void;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
  start: () => void;
  updateCallAssignment: (
    data: CallAssignmentPatchBody
  ) => Promise<CallAssignmentData>;
  deleteAssignment: () => void;
}

export default function useCallAssignment(
  orgId: number,
  assignmentId: number
): UseCallAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignmentSlice = useAppSelector((state) => state.callAssignments);
  const callAssignmentItems = callAssignmentSlice.assignmentList.items;
  const caItem = callAssignmentItems.find((item) => item.id == assignmentId);

  const callAssignment = useRemoteItem(caItem, {
    actionOnLoad: () => callAssignmentLoad(assignmentId),
    actionOnSuccess: (data) => callAssignmentLoaded(data),
    cacheKey: `callAssignment-${orgId}-${assignmentId}`,
    loader: () =>
      apiClient.get<ZetkinCallAssignment>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}`
      ),
  });

  const isTargeted = !!(
    callAssignment && callAssignment.target?.filter_spec?.length != 0
  );

  const updateTargets = (query: Partial<ZetkinQuery>): void => {
    if (callAssignment) {
      dispatch(callAssignmentUpdate([assignmentId, ['target']]));
      fetch(`/api/orgs/${orgId}/people/queries/${callAssignment.target.id}`, {
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) => {
          dispatch(
            callAssignmentUpdated([
              { ...callAssignment, target: data.data },
              ['target'],
            ])
          );
        });
    }
  };

  const updateGoal = (query: Partial<ZetkinQuery>) => {
    // TODO: Refactor once SmartSearch is supported in redux framework
    if (callAssignment) {
      dispatch(callAssignmentUpdate([assignmentId, ['goal']]));
      fetch(`/api/orgs/${orgId}/people/queries/${callAssignment.goal.id}`, {
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) =>
          dispatch(
            callAssignmentUpdated([
              { ...callAssignment, goal: data.data },
              ['goal'],
            ])
          )
        );
    }
  };

  const updateCallAssignment = async (
    data: CallAssignmentPatchBody
  ): Promise<CallAssignmentData> => {
    const mutatingAttributes = Object.keys(data);

    dispatch(callAssignmentUpdate([assignmentId, mutatingAttributes]));
    const callAssignmentData = await apiClient.patch<CallAssignmentData>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}`,
      data
    );
    dispatch(callAssignmentUpdated([callAssignmentData, mutatingAttributes]));
    return callAssignmentData;
  };

  const start = () => {
    if (!callAssignment) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = callAssignment;

    if (!startStr && !endStr) {
      updateCallAssignment({
        start_date: today,
      });
    } else if (!startStr) {
      // End date is non-null
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        updateCallAssignment({
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        updateCallAssignment({
          start_date: today,
        });
      }
    } else if (!endStr) {
      // Start date is non-null
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        // End date is null, start date is future
        updateCallAssignment({
          start_date: today,
        });
      }
    } else {
      // Start and end date are non-null
      const startDate = dayjs(startStr);
      const endDate = dayjs(endStr);

      if (
        (startDate.isBefore(today) || startDate.isSame(today)) &&
        (endDate.isBefore(today) || endDate.isSame(today))
      ) {
        // Start is past, end is past
        updateCallAssignment({
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        // Start is future, end is future
        updateCallAssignment({
          start_date: today,
        });
      }
    }
  };

  const end = () => {
    if (!callAssignment) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateCallAssignment({
      end_date: today,
    });
  };

  const deleteAssignment = async () => {
    await apiClient.delete(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}`
    );
    dispatch(callAssignmentDeleted(assignmentId));
  };

  return {
    data: callAssignment,
    deleteAssignment,
    end,
    error: null,
    isLoading: !callAssignment,
    isTargeted,
    start,
    updateCallAssignment,
    updateGoal,
    updateTargets,
  };
}
