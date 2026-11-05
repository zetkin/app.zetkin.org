import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { userUpdated } from 'features/manage/store';

export default function useUserActions(userId?: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const sendPasswordReset = useCallback(async () => {
    if (typeof userId === 'undefined') {
      return;
    }

    await apiClient.post(`/api/users/${userId}/verification_codes`, '');
  }, [apiClient, userId]);

  const updateUser = useCallback(
    async (diffUser: Partial<Omit<ZetkinUser, 'id'>>) => {
      if (typeof userId === 'undefined') {
        return;
      }

      const resultingUser = await apiClient.patch<
        ZetkinUser,
        Partial<ZetkinUser>
      >(`/api/users/${userId}`, diffUser);
      dispatch(userUpdated(resultingUser));
    },
    [apiClient, dispatch, userId]
  );

  return useMemo(
    () => ({ sendPasswordReset, updateUser }),
    [updateUser, sendPasswordReset]
  );
}
