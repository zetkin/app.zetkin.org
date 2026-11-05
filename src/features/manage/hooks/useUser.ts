import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { serializeError } from 'utils/storeUtils/serializeError';
import { userError, userLoad, userLoaded } from 'features/manage/store';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useUser(userId: number) {
  const apiClient = useApiClient();

  const userItem = useAppSelector((state) => state.manage.usersById[userId]);

  if (userItem?.error) {
    throw new Error(serializeError(userItem.error));
  }

  return useRemoteItem(userItem, {
    actionOnError: (err) => userError([userId, serializeError(err)]),
    actionOnLoad: () => userLoad(userId),
    actionOnSuccess: (users) => userLoaded(users),
    loader: () => apiClient.get<ZetkinUser>(`/api/users/${userId}`),
  });
}
