import { useMemo } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinChannel, ZetkinPersonChannelPreference } from '../types';
import {
  channelLoaded,
  personChannelPreferencesError,
  personChannelPreferencesLoad,
  personChannelPreferencesLoaded,
} from '../store';
import { serializeError } from 'utils/storeUtils/serializeError';

export default function usePersonChannelPreferences(
  orgId: number,
  personId: number
): [
  IFuture<ZetkinPersonChannelPreference[]>,
  Record<number, ZetkinChannel | undefined>,
] {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const [preferences, channels] = useAppSelector((state) => [
    state.emails.channelPreferencesByPersonId[personId],
    state.emails.channelsById,
  ]);
  const channelsById = useMemo(
    () =>
      Object.values(channels).reduce(
        (prev, channel) => {
          if (channel?.data) {
            prev[channel.data.id] = channel.data;
          }
          return prev;
        },
        {} as Record<number, ZetkinChannel | undefined>
      ),
    [channels]
  );

  const channelPreferencesFuture = loadListIfNecessary(preferences, dispatch, {
    actionOnError: (err) =>
      personChannelPreferencesError([personId, serializeError(err)]),
    actionOnLoad: () => personChannelPreferencesLoad(personId),
    actionOnSuccess: (preferences) =>
      personChannelPreferencesLoaded([personId, preferences]),
    loader: async () => {
      const resp = await apiClient.get<
        ZetkinPersonChannelPreference[],
        { channels: Record<number, ZetkinChannel | undefined> }
      >(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences/channels`,
        true
      );
      Object.values(resp.related.channels).forEach((channel) => {
        dispatch(channelLoaded(channel!));
      });
      return resp.data;
    },
  });

  return useMemo(
    () => [channelPreferencesFuture, channelsById],
    [channelPreferencesFuture, channelsById]
  );
}
