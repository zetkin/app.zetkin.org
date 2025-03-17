import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinCall } from '../types';
import { currentCallLoad, currentCallLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCallWithTarget(
  orgId: number,
  assignmentId: number
): { call: ZetkinCall; refreshCall: () => Promise<ZetkinCall> } {
  const apiClient = useApiClient();
  const callItem = useAppSelector((state) => state.call.currentCall);
  const dispatch = useAppDispatch();

  const loader = async (): Promise<ZetkinCall> => {
    return apiClient.post<ZetkinCall>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
      {}
    );
  };

  const call = useRemoteItem(callItem, {
    actionOnLoad: () => dispatch(currentCallLoad()),
    actionOnSuccess: (data) => dispatch(currentCallLoaded(data)),
    loader,
  });

  const refreshCall = async () => {
    dispatch(currentCallLoad());
    const data = await loader();
    dispatch(currentCallLoaded(data));
    return data;
  };

  return { call, refreshCall };
}
