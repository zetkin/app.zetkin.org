import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { ZetkinUser } from 'utils/types/zetkin';
import { useDispatch, useSelector } from 'react-redux';
import { userLoad, userLoaded } from '../store/store';

const useCurrentUser = () => {
  const apiClient = useApiClient();
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);
  const isServer = useServerSide();

  if (isServer) {
    return null;
  }

  if (shouldLoad(userState.userItem)) {
    dispatch(userLoad());
    apiClient.get<ZetkinUser>(`/api/users/me`).then((user) => {
      dispatch(userLoaded(user));
    });
  }
  return userState.userItem.data;
};

export default useCurrentUser;
