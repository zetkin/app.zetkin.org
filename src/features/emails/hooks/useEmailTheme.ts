import { EmailTheme, EmailThemePatchBody } from 'features/emails/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  themeCreated,
  themeDeleted,
  themeLoad,
  themeLoaded,
  themeUpdate,
  themeUpdated,
  themeUpdateErrorAdded,
  themeUpdateErrorRemoved,
} from 'features/emails/store';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject } from 'core/caching/futures';
import { ApiClientError } from 'core/api/errors';

export default function useEmailTheme(orgId: number, themeId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const themeItems = useAppSelector((state) => state.emails.themeList.items);
  const themeItem = themeItems.find((item) => item.id == themeId);
  const themeUpdateError = useAppSelector(
    (state) => state.emails.themeUpdateError
  );
  const themeJsonError = useAppSelector((state) => state.emails.themeJsonError);

  const themeFuture = loadItemIfNecessary(themeItem, dispatch, {
    actionOnLoad: () => themeLoad(themeId),
    actionOnSuccess: (theme) => themeLoaded(theme),
    loader: () =>
      apiClient.get<EmailTheme>(`/api/orgs/${orgId}/email_themes/${themeId}`),
  });

  const deleteEmailTheme = async (themeId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/email_themes/${themeId}`);
    dispatch(themeDeleted([orgId, themeId]));
  };

  const duplicateEmailTheme = async () => {
    const oldTheme = themeFuture.data;
    if (!oldTheme) {
      return;
    }

    const newTheme = await apiClient.post<EmailTheme>(
      `/api/orgs/${orgId}/email_themes`,
      {
        block_attributes: oldTheme.block_attributes,
        css: oldTheme.css,
        frame_mjml: oldTheme.frame_mjml,
      }
    );
    dispatch(themeCreated([newTheme, orgId]));
    return newTheme;
  };

  const updateEmailTheme = async (data: EmailThemePatchBody) => {
    const mutating = Object.keys(data);
    dispatch(themeUpdate([themeId, mutating]));
    try {
      return await apiClient
        .patch<EmailTheme>(`/api/orgs/${orgId}/email_themes/${themeId}`, data)
        .then((theme: EmailTheme) => {
          dispatch(themeUpdated([theme, mutating]));
          return theme;
        });
    } catch (e) {
      const updateError =
        e instanceof ApiClientError ? e : new Error('Unknown error');
      const serialized = {
        message: updateError.message,
        name: updateError.name,
      };
      dispatch(themeUpdateErrorAdded(serialized));
      return updateError;
    }
  };

  const clearUpdateEmailThemeError = () => {
    dispatch(themeUpdateErrorRemoved());
  };

  return {
    ...futureToObject(themeFuture),
    clearUpdateEmailThemeError,
    deleteEmailTheme,
    duplicateEmailTheme,
    mutating: themeItem?.mutating || [],
    themeJsonError,
    themeUpdateError,
    updateEmailTheme,
  };
}
