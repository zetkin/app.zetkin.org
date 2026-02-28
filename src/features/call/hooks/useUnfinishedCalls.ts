import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { UnfinishedCall } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';
import { unfinishedCallsLoad, unfinishedCallsLoaded } from '../store';

export default function useUnfinishedCalls(): UnfinishedCall[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const unfinishedCalls = useAppSelector((state) => state.call.unfinishedCalls);

  return useRemoteList(unfinishedCalls, {
    actionOnLoad: () => dispatch(unfinishedCallsLoad()),
    actionOnSuccess: (data) => dispatch(unfinishedCallsLoaded(data)),
    loader: () => {
      return apiClient.get<
        UnfinishedCall[]
      >(`/api/users/me/outgoing_calls?p=0&pp=200&filter=state==0
        `);
    },
  });
}
