import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { userUpdated } from 'features/user/store';

export default function useUserMutations() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async updateUser(data: Partial<Omit<ZetkinUser, 'id'>>) {
      const updated = await apiClient.patch<ZetkinUser>(`/api/users/me`, data);

      dispatch(userUpdated(updated));
    },
  };
}
