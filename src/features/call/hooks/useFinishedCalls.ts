import { useEffect, useState } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { FinishedCall } from '../types';
import { finishedCallsLoad, finishedCallsLoaded } from '../store';

export default function useFinishedCalls() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const [finishedCalls, setFinishedCalls] = useState<FinishedCall[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadFinishedCalls = async () => {
    dispatch(finishedCallsLoad());
    if (finishedCalls.length == 0) {
      setLoading(true);
    }
    const newLoadedFinishedCalls = await apiClient.get<
      FinishedCall[]
    >(`/api/users/me/outgoing_calls?p=${pageNumber}&pp=20&filter=state!=0
         `);

    const loadedFinishedCalls = [...finishedCalls, ...newLoadedFinishedCalls];
    dispatch(finishedCallsLoaded(loadedFinishedCalls));
    setFinishedCalls(loadedFinishedCalls);

    if (newLoadedFinishedCalls.length == 0) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinishedCalls();
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(pageNumber + 1);
  }, [finishedCalls.length]);

  return {
    finishedCalls,
    loading,
  };
}
