import { EmailTheme, EmailThemePatchBody } from 'features/emails/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  themeDeleted,
  themeLoad,
  themeLoaded,
  themeUpdate,
  themeUpdated,
} from 'features/emails/store';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { futureToObject } from 'core/caching/futures';
import { ApiClientError } from 'core/api/errors';

interface UseCreateEmailThemeReturn {
  data: EmailTheme | null;
  deleteEmailTheme: (themeId: number) => Promise<void>;
  updateEmailTheme: (data: EmailThemePatchBody) => Promise<EmailTheme | string>;
  isLoading: boolean;
  mutating: string[];
}

export default function useEmailTheme(
  orgId: number,
  themeId: number
): UseCreateEmailThemeReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const themeItem = useAppSelector((state) => state.emails.themesById[themeId]);

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

  const updateEmailTheme = async (data: EmailThemePatchBody) => {
    const mutating = Object.keys(data);
    dispatch(themeUpdate([themeId, mutating]));
    try {
      return await apiClient
        .patch<EmailTheme>(`/api/orgs/${orgId}/email_themes/${themeId}`, data)
        .then((theme: EmailTheme) => {
          dispatch(themeUpdated([orgId, theme, mutating]));
          return theme;
        });
    } catch (e) {
      return e instanceof ApiClientError
        ? e.errorDescription || 'Unknown error'
        : 'Unknown error';
    }
  };

  return {
    ...futureToObject(themeFuture),
    deleteEmailTheme,
    mutating: themeItem?.mutating || [],
    updateEmailTheme,
  };
}
