import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { FinishedCall } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';
import { finishedCallsLoad, finishedCallsLoaded } from '../store';

export default function useFinishedCalls(): FinishedCall[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const finishedCalls = useAppSelector((state) => state.call.finishedCalls);

  return useRemoteList(finishedCalls, {
    actionOnLoad: () => dispatch(finishedCallsLoad()),
    actionOnSuccess: (data) => dispatch(finishedCallsLoaded(data)),
    loader: () => {
      return apiClient.get<
        FinishedCall[]
      >(`/api/users/me/outgoing_calls?p=0&pp=200&filter=state!=0
        `);
    },
  });
}
