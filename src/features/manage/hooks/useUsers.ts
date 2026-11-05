import { usersError, usersLoad, usersLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import useRemoteList from 'core/hooks/useRemoteList';
import { serializeError } from 'utils/storeUtils/serializeError';

export default function useUsers(): ZetkinUser[] {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.manage.users);

  if (list?.error) {
    throw new Error(serializeError(list.error));
  }

  return useRemoteList(list, {
    actionOnError: (err) => usersError(serializeError(err)),
    actionOnLoad: () => usersLoad(),
    actionOnSuccess: (users) => usersLoaded(users),
    loader: () => apiClient.get<ZetkinUser[]>(`/api/users`),
  });
}
