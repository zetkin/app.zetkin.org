import { EmailTheme } from 'features/emails/types';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { themeCreate, themeCreated, themeDeleted } from 'features/emails/store';

interface UseCreateEmailThemeReturn {
  createEmailTheme: () => Promise<EmailTheme>;
  deleteEmailTheme: (themeId: number) => Promise<void>;
}

export default function useEmailThemeMutations(
  orgId: number
): UseCreateEmailThemeReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEmailTheme = async () => {
    dispatch(themeCreate);
    const theme = await apiClient.post<EmailTheme>(
      `/api/orgs/${orgId}/email_themes`,
      { frame_mjml: null }
    );
    dispatch(themeCreated(theme));
    return theme;
  };

  const deleteEmailTheme = async (themeId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/email_themes/${themeId}`);
    dispatch(themeDeleted(themeId));
  };

  return { createEmailTheme, deleteEmailTheme };
}
