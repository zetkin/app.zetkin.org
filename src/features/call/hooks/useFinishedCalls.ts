import { useCallback, useMemo, useRef } from 'react';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { FinishedCall } from '../types';
import { finishedCallsLoad, finishedCallsLoaded } from '../store';
import shouldLoad from 'core/caching/shouldLoad';
import notEmpty from 'utils/notEmpty';

export default function useFinishedCalls() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const finishedCallsList = useAppSelector((state) => state.call.finishedCalls);

  const allLoadedCallsRef = useRef<FinishedCall[]>([]);

  const loadPage = useCallback(
    async (pageNumber: number) => {
      dispatch(finishedCallsLoad());
      const newLoadedFinishedCalls = await apiClient.get<FinishedCall[]>(
        `/api/users/me/outgoing_calls?p=${pageNumber}&pp=20&filter=state!=0`
      );

      allLoadedCallsRef.current = [
        ...allLoadedCallsRef.current,
        ...newLoadedFinishedCalls,
      ];
      dispatch(finishedCallsLoaded(allLoadedCallsRef.current));

      if (newLoadedFinishedCalls.length > 0) {
        loadPage(pageNumber + 1);
      }
    },
    [apiClient, dispatch]
  );

  if (shouldLoad(finishedCallsList)) {
    loadPage(0);
  }

  const filteredFinishedCalls = useMemo(
    () =>
      finishedCallsList.items
        .filter((item) => !item.deleted)
        .map((item) => item.data)
        .filter(notEmpty),
    [finishedCallsList.items]
  );

  return {
    finishedCalls: filteredFinishedCalls,
    isLoading: finishedCallsList.isLoading,
  };
}
