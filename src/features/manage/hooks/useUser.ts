import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { serializeError } from 'utils/storeUtils/serializeError';
import { userError, userLoad, userLoaded } from 'features/manage/store';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useUser(userId: number): ZetkinUser {
  const apiClient = useApiClient();
  const item = useAppSelector((state) => state.manage.usersById[userId]);

  if (item?.error) {
    throw new Error(serializeError(item.error));
  }

  return useRemoteItem(item, {
    actionOnError: (err) => userError([userId, serializeError(err)]),
    actionOnLoad: () => userLoad(userId),
    actionOnSuccess: (users) => userLoaded(users),
    loader: () => apiClient.get<ZetkinUser>(`/api/users/${userId}`),
  });
}
