import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { unfinishedCallsLoad, unfinishedCallsLoaded } from '../store';
import { ZetkinCall } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useUnfinishedCalls(): ZetkinCall[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const outgoingList = useAppSelector((state) => state.call.unfinishedCalls);

  return useRemoteList(outgoingList, {
    actionOnLoad: () => dispatch(unfinishedCallsLoad()),
    actionOnSuccess: (data) => dispatch(unfinishedCallsLoaded(data)),
    loader: () => {
      return apiClient.get<
        ZetkinCall[]
      >(`/api/users/me/outgoing_calls?p=0&pp=200&filter=state==0
        `);
    },
  });
}
