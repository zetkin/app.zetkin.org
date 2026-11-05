import { useCallback, useContext, useMemo } from 'react';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { serializeError } from 'utils/storeUtils/serializeError';
import {
  userError,
  userLoad,
  userLoaded,
  userUpdateError,
  userUpdate,
  userUpdated,
} from 'features/manage/store';
import useRemoteItem from 'core/hooks/useRemoteItem';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { useMessages } from 'core/i18n';
import messageIds from 'features/manage/l10n/messageIds';

export default function useUser(
  userId: number
): [
  ZetkinUser,
  (updatedUser: ZetkinUser) => Promise<void>,
  boolean | undefined,
] {
  const messages = useMessages(messageIds);
  const apiClient = useApiClient();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const dispatch = useAppDispatch();

  const userItem = useAppSelector((state) => state.manage.usersById[userId]);
  const userUpdating = useAppSelector(
    (state) => state.manage.updatingById[userId]
  );

  if (userItem?.error) {
    throw new Error(serializeError(userItem.error));
  }

  const user = useRemoteItem(userItem, {
    actionOnError: (err) => userError([userId, serializeError(err)]),
    actionOnLoad: () => userLoad(userId),
    actionOnSuccess: (users) => userLoaded(users),
    loader: () => apiClient.get<ZetkinUser>(`/api/users/${userId}`),
  });

  const updateUser = useCallback(
    async (updatedUser: ZetkinUser) => {
      if (updatedUser.id !== user.id) {
        throw new Error('Trying to update user that is not the current user.');
      }

      const diff: Partial<ZetkinUser> = {};

      const copyIfChanged = <K extends keyof ZetkinUser>(key: K) => {
        if (user[key] !== updatedUser[key]) {
          diff[key] = updatedUser[key];
        }
      };

      for (const key of Object.keys(updatedUser)) {
        copyIfChanged(key as keyof ZetkinUser);
      }

      dispatch(userUpdate(user.id));
      try {
        const resultingUser = await apiClient.patch<
          ZetkinUser,
          Partial<ZetkinUser>
        >(`/api/users/${user.id}`, diff);
        dispatch(userUpdated(resultingUser));
        showSnackbar('success', messages.users.details.edit.updateSuccess());
      } catch (err) {
        dispatch(userUpdateError([user.id, serializeError(err)]));
        showSnackbar('error', messages.users.details.edit.updateError());
      }
    },
    [apiClient, dispatch, messages.users.details.edit, showSnackbar, user]
  );

  return useMemo(
    () => [user, updateUser, userUpdating],
    [updateUser, user, userUpdating]
  );
}
