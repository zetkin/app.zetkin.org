import { useEffect, useState } from 'react';

import { CallAssignmentData } from '../apiTypes';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { callAssignmentsLoad, callAssignmentsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useCallAssignments(
  orgId: number,
  active?: boolean
): IFuture<CallAssignmentData[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assignmentList = useAppSelector(
    (state) => state.callAssignments.assignmentList
  );
  const [filteredAssignments, setFilteredAssignments] = useState<{
    data: CallAssignmentData[] | null;
    error: unknown | null;
    isLoading: boolean;
    key: string;
  }>({
    data: null,
    error: null,
    isLoading: false,
    key: '',
  });

  const activeFilterIsSet = typeof active === 'boolean';
  const filteredAssignmentsKey = `${orgId}:${active}`;

  useEffect(() => {
    if (!activeFilterIsSet) {
      return;
    }

    let wasCanceled = false;

    setFilteredAssignments({
      data: null,
      error: null,
      isLoading: true,
      key: filteredAssignmentsKey,
    });

    apiClient
      .get<CallAssignmentData[]>(
        `/api/orgs/${orgId}/call_assignments/?active=${active}`
      )
      .then((assignments) => {
        if (!wasCanceled) {
          setFilteredAssignments({
            data: assignments,
            error: null,
            isLoading: false,
            key: filteredAssignmentsKey,
          });
        }
      })
      .catch((err) => {
        if (!wasCanceled) {
          setFilteredAssignments({
            data: null,
            error: err,
            isLoading: false,
            key: filteredAssignmentsKey,
          });
        }
      });

    return () => {
      wasCanceled = true;
    };
  }, [active, activeFilterIsSet, apiClient, filteredAssignmentsKey, orgId]);

  if (activeFilterIsSet) {
    if (
      filteredAssignments.isLoading ||
      filteredAssignments.key !== filteredAssignmentsKey
    ) {
      return new LoadingFuture();
    }

    if (filteredAssignments.error) {
      return new ErrorFuture(filteredAssignments.error);
    }

    return new ResolvedFuture(filteredAssignments.data || []);
  }

  return loadListIfNecessary(assignmentList, dispatch, {
    actionOnLoad: () => callAssignmentsLoad(),
    actionOnSuccess: (data) => callAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<CallAssignmentData[]>(
        `/api/orgs/${orgId}/call_assignments/`
      ),
  });
}
