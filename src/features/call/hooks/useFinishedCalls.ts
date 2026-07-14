import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { FinishedCall } from '../types';
import { finishedCallsLoad, finishedCallsLoaded } from '../store';
import shouldLoad from 'core/caching/shouldLoad';
import notEmpty from 'utils/notEmpty';

export default function useFinishedCalls() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const finishedCallsList = useAppSelector((state) => state.call.finishedCalls);

  let allLoadedCalls: FinishedCall[] = [];

  const loadPage = async (pageNumber: number) => {
    dispatch(finishedCallsLoad());
    const newLoadedFinishedCalls = await apiClient.get<FinishedCall[]>(
      `/api/users/me/outgoing_calls?p=${pageNumber}&pp=20&filter=state!=0`
    );

    allLoadedCalls = [...allLoadedCalls, ...newLoadedFinishedCalls];
    dispatch(finishedCallsLoaded(allLoadedCalls));

    if (newLoadedFinishedCalls.length > 0) {
      loadPage(pageNumber + 1);
    }
  };

  if (shouldLoad(finishedCallsList)) {
    loadPage(0);
  }

  return {
    finishedCalls: finishedCallsList.items
      .filter((item) => !item.deleted)
      .map((item) => item.data)
      .filter(notEmpty),
    isLoading: finishedCallsList.isLoading,
  };
}
