import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { ZetkinCanvassSession } from '../types';

export default function useMyCanvassSessions() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const mySessions = useAppSelector(
    (state) => state.canvassAssignments.mySessionsList
  );

  return loadListIfNecessary(mySessions, dispatch, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCanvassSession[]>(
        '/beta/users/me/canvassassignments'
      ),
  });
}
