import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { userUpdated } from 'features/manage/store';

export default function useUserActions(user: ZetkinUser) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const sendVerificationCode = useCallback(
    () => apiClient.post(`/api/users/${user.id}/verification_codes`, ''),
    [apiClient, user.id]
  );

  const sendPasswordReset = useCallback(
    () =>
      apiClient.post(`/api/password_reset_tokens`, {
        email: user.email,
      }),
    [apiClient, user.email]
  );

  const updateUser = useCallback(
    (diffUser: Partial<Omit<ZetkinUser, 'id'>>) =>
      apiClient
        .patch<
          ZetkinUser,
          Partial<ZetkinUser>
        >(`/api/users/${user.id}`, diffUser)
        .then((resultingUser) => dispatch(userUpdated(resultingUser))),
    [apiClient, dispatch, user]
  );

  return useMemo(
    () => ({ sendPasswordReset, sendVerificationCode, updateUser }),
    [updateUser, sendVerificationCode, sendPasswordReset]
  );
}
