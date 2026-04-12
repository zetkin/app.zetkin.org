import { useDispatch } from 'react-redux';

import { EmailTheme } from 'features/emails/types';
import { useApiClient } from 'core/hooks';
import { themeCreate, themeCreated } from 'features/emails/store';

interface UseCreateEmailThemeReturn {
  createEmailTheme: () => Promise<EmailTheme>;
}

export default function useCreateEmailTheme(
  orgId: number
): UseCreateEmailThemeReturn {
  const apiClient = useApiClient();
  const dispatch = useDispatch();

  const createEmailTheme = async () => {
    dispatch(themeCreate);
    const theme = await apiClient.post<EmailTheme>(
      `/api/orgs/${orgId}/email_themes`,
      { frame_mjml: null }
    );
    dispatch(themeCreated([theme, orgId]));
    return theme;
  };

  return { createEmailTheme };
}
