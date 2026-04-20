import { EmailTheme } from 'features/emails/types';
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

interface UseCreateEmailThemeReturn {
  data: EmailTheme | null;
  deleteEmailTheme: (themeId: number) => Promise<void>;
  updateEmailTheme: (data: EmailTheme) => Promise<EmailTheme>;
  isLoading: boolean;
  mutating: string[];
}

export default function useEmailTheme(
  orgId: number,
  themeId: number
): UseCreateEmailThemeReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const themeItems = useAppSelector((state) => state.emails.themeList.items);
  const themeItem = themeItems.find((item) => item.id == themeId);

  const themeFuture = loadItemIfNecessary(themeItem, dispatch, {
    actionOnLoad: () => themeLoad(themeId),
    actionOnSuccess: (theme) => themeLoaded(theme),
    loader: () =>
      apiClient.get<EmailTheme>(`/api/orgs/${orgId}/email_themes/${themeId}`),
  });

  const deleteEmailTheme = async (themeId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/email_themes/${themeId}`);
    dispatch(themeDeleted(themeId));
  };

  const updateEmailTheme = async (data: EmailTheme) => {
    const mutating = Object.keys(data);
    dispatch(themeUpdate([data.id, mutating]));
    return await apiClient
      .patch<EmailTheme>(`/api/orgs/${orgId}/email_themes/${themeId}`, data)
      .then((theme: EmailTheme) => {
        dispatch(themeUpdated([theme, mutating]));
        return theme;
      });
  };

  return {
    ...futureToObject(themeFuture),
    deleteEmailTheme,
    mutating: themeItem?.mutating || [],
    updateEmailTheme,
  };
}
