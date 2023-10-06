import { CallAssignmentData } from '../apiTypes';
import dayjs from 'dayjs';
import shouldLoad from 'core/caching/shouldLoad';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCallAssignment, ZetkinQuery } from 'utils/types/zetkin';

interface UseCallAssignmentReturn {
  data: ZetkinCallAssignment | null;
  end: () => void;
  isTargeted: boolean;
  updateGoal: (query: Partial<ZetkinQuery>) => void;
  updateTargets: (query: Partial<ZetkinQuery>) => void;
  start: () => void;
  updateCallAssignment: (data: Partial<ZetkinCallAssignment>) => void;
}

export default function useCallAssignment(
  orgId: number,
  assignmentId: number
): UseCallAssignmentReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const callAssignmentSlice = useAppSelector((state) => state.callAssignments);
  const callAssignmentItems = callAssignmentSlice.assignmentList.items;

  const getData = (): IFuture<CallAssignmentData> => {
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);

    if (!caItem || shouldLoad(caItem)) {
      dispatch(callAssignmentLoad(assignmentId));
      const promise = apiClient
        .get<CallAssignmentData>(
          `/api/orgs/${orgId}/call_assignments/${assignmentId}`
        )
        .then((data: CallAssignmentData) => {
          dispatch(callAssignmentLoaded(data));
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

  const updateTargets = (query: Partial<ZetkinQuery>): void => {
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);
    const callAssignment = caItem?.data;

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

  const updateGoal = (query: Partial<ZetkinQuery>): void => {
    // TODO: Refactor once SmartSearch is supported in redux framework
    const caItem = callAssignmentItems.find((item) => item.id == assignmentId);
    const callAssignment = caItem?.data;

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

  const updateCallAssignment = (
    data: Partial<CallAssignmentData>
  ): IFuture<CallAssignmentData> => {
    const mutatingAttributes = Object.keys(data);

    dispatch(callAssignmentUpdate([assignmentId, mutatingAttributes]));
    const promise = apiClient
      .patch<CallAssignmentData>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}`,
        data
      )
      .then((data: CallAssignmentData) => {
        dispatch(callAssignmentUpdated([data, mutatingAttributes]));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const start = () => {
    const { data } = getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = data;

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
    const { data } = getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    updateCallAssignment({
      end_date: today,
    });
  };

  return {
    data: getData().data,
    end,
    isTargeted: isTargeted(),
    start,
    updateCallAssignment,
    updateGoal,
    updateTargets,
  };
}
