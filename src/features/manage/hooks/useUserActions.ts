import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { userUpdated } from 'features/manage/store';

export default function useUserActions(userId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const sendVerificationCode = useCallback(
    () => apiClient.post(`/api/users/${userId}/verification_codes`, ''),
    [apiClient, userId]
  );

  const updateUser = useCallback(
    (diffUser: Partial<Omit<ZetkinUser, 'id'>>) =>
      apiClient
        .patch<
          ZetkinUser,
          Partial<ZetkinUser>
        >(`/api/users/${userId}`, diffUser)
        .then((resultingUser) => dispatch(userUpdated(resultingUser))),
    [apiClient, dispatch, userId]
  );

  return useMemo(
    () => ({ sendVerificationCode, updateUser }),
    [updateUser, sendVerificationCode]
  );
}
