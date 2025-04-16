import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinCall } from '../types';
import { currentCallLoad, currentCallLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';

export default function useCallWithTarget(
  orgId: number,
  assignmentId: number
): ZetkinCall {
  const apiClient = useApiClient();
  const callItem = useAppSelector((state) => state.call.currentCall);

  const callWithTarget = useRemoteItem(callItem, {
    actionOnLoad: () => currentCallLoad(),
    actionOnSuccess: (data) => currentCallLoaded(data),
    loader: () =>
      apiClient.post<ZetkinCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      ),
  });

  return callWithTarget;
}
