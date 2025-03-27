import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { outgoingCallsLoad, outgoingCallsLoaded } from '../store';
import { ZetkinCall } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useOutgoingCalls(): ZetkinCall[] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const outgoingList = useAppSelector((state) => state.call.outgoingCalls);

  const outgoingCalls = useRemoteList(outgoingList, {
    actionOnLoad: () => dispatch(outgoingCallsLoad()),
    actionOnSuccess: (data) => dispatch(outgoingCallsLoaded(data)),
    loader: () => {
      return apiClient.get<
        ZetkinCall[]
      >(`/api/users/me/outgoing_calls?p=0&pp=200
        `);
    },
  });

  return outgoingCalls;
}
