import useRemoteItem from 'core/hooks/useRemoteItem';
import useServerSide from 'core/useServerSide';
import { ZetkinUser } from 'utils/types/zetkin';
import { useApiClient, useAppSelector } from 'core/hooks';
import { userLoad, userLoaded } from '../store';

const useCurrentUser = (): ZetkinUser | null => {
  const apiClient = useApiClient();
  const userState = useAppSelector((state) => state.user);
  const isServer = useServerSide();

  const user = useRemoteItem(userState.userItem, {
    actionOnLoad: () => userLoad(),
    actionOnSuccess: (user) => userLoaded(user),
    loader: () => apiClient.get<ZetkinUser>(`/api/users/me`),
  });

  if (isServer) {
    return null;
  }

  return user;
};

export default useCurrentUser;
