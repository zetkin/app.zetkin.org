import { useMemo } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinEmailChannel,
  ZetkinPersonEmailChannelPreference,
} from '../types';
import {
  channelLoaded,
  personChannelPreferencesError,
  personChannelPreferencesLoad,
  personChannelPreferencesLoaded,
} from '../store';
import { serializeError } from 'utils/storeUtils/serializeError';

export default function usePersonEmailChannelPreferences(
  orgId: number,
  personId: number
): [
  IFuture<ZetkinPersonEmailChannelPreference[]>,
  Record<number, ZetkinEmailChannel>,
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
        {} as Record<number, ZetkinEmailChannel>
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
        ZetkinPersonEmailChannelPreference[],
        { channels: Record<number, ZetkinEmailChannel> }
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
