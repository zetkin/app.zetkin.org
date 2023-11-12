import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEventResponse } from 'utils/types/zetkin';
import { signupsLoad, signupsLoaded } from 'features/events/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventSignups(): IFuture<ZetkinEventResponse[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const signupsList = useAppSelector((state) => state.events.signupsList);

  return loadListIfNecessary(signupsList, dispatch, {
    actionOnLoad: () => dispatch(signupsLoad()),
    actionOnSuccess: (data) => dispatch(signupsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinEventResponse[]>(`/api/users/me/action_responses`),
  });
}
