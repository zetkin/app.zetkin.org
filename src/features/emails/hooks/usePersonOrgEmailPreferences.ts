import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinPersonOrgEmailPreferences } from '../types';
import {
  personOrgEmailPreferencesError,
  personOrgEmailPreferencesLoad,
  personOrgEmailPreferencesLoaded,
} from '../store';

export default function usePersonOrgEmailPreferences(
  orgId: number,
  personId: number
): IFuture<ZetkinPersonOrgEmailPreferences> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const preferencesItem = useAppSelector(
    (state) => state.emails.orgEmailPreferencesByPersonId[personId]
  );

  return loadItemIfNecessary(preferencesItem, dispatch, {
    actionOnError: (err) => personOrgEmailPreferencesError([personId, err]),
    actionOnLoad: () => personOrgEmailPreferencesLoad(personId),
    actionOnSuccess: (preferences) =>
      personOrgEmailPreferencesLoaded([personId, preferences]),
    loader: () =>
      apiClient.get<ZetkinPersonOrgEmailPreferences>(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences`
      ),
  });
}
