import { useApiClient, useAppSelector } from 'core/hooks';
import { UnfinishedCall } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';
import { unfinishedCallsLoad, unfinishedCallsLoaded } from '../store';

export default function useUnfinishedCalls(orgId: number): UnfinishedCall[] {
  const apiClient = useApiClient();
  const unfinishedCalls = useAppSelector(
    (state) => state.call.unfinishedCallsByOrgId[orgId]
  );

  return useRemoteList(unfinishedCalls, {
    actionOnLoad: () => unfinishedCallsLoad(orgId),
    actionOnSuccess: (data) => unfinishedCallsLoaded([orgId, data]),
    loader: () => {
      return apiClient.get<
        UnfinishedCall[]
      >(`/api/users/me/outgoing_calls?p=0&pp=200&filter=state==0
        `);
    },
  });
}
