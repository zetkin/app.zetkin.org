import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinPersonEmailPreferences } from '../types';
import {
  personEmailPreferencesError,
  personEmailPreferencesLoad,
  personEmailPreferencesLoaded,
} from '../store';

export default function usePersonEmailPreferences(
  orgId: number,
  personId: number
): IFuture<ZetkinPersonEmailPreferences> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const preferencesItem = useAppSelector(
    (state) => state.emails.preferencesByPersonId[personId]
  );

  return loadItemIfNecessary(preferencesItem, dispatch, {
    actionOnError: (err) => personEmailPreferencesError([personId, err]),
    actionOnLoad: () => personEmailPreferencesLoad(personId),
    actionOnSuccess: (preferences) =>
      personEmailPreferencesLoaded([personId, preferences]),
    loader: () =>
      apiClient.get<ZetkinPersonEmailPreferences>(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences`
      ),
  });
}
