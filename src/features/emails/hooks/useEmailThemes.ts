import { EmailTheme } from '../types';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { themesLoad, themesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEmailThemes(orgId: number): IFuture<EmailTheme[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const themeList = useAppSelector((store) => store.emails.themeList);

  return loadListIfNecessary(themeList, dispatch, {
    actionOnLoad: () => themesLoad(),
    actionOnSuccess: (themes) => themesLoaded(themes),
    loader: () => apiClient.get(`/api/orgs/${orgId}/email_themes`),
  });
}
