import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { userUpdated } from 'features/manage/store';

export default function useUserActions(userId?: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const userUpdating = !!useAppSelector(
    (state) => userId && state.manage.updatingById[userId]
  );

  const sendPasswordReset = useCallback(
    async (resetEmailVerification: boolean) => {
      if (typeof userId === 'undefined') {
        return;
      }

      if (resetEmailVerification) {
        const resultingUser = await apiClient.patch<
          ZetkinUser,
          Partial<ZetkinUser>
        >(`/api/users/${userId}`, { email_is_verified: false });
        dispatch(userUpdated(resultingUser));
      }

      await apiClient.post(`/api/users/${userId}/verification_codes`, '');
    },
    [apiClient, dispatch, userId]
  );

  return useMemo(
    () => ({ sendPasswordReset, userUpdating }),
    [sendPasswordReset, userUpdating]
  );
}
