import { useCallback } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  personChannelPreferencesInvalidated,
  personChannelPreferenceUpdated,
} from '../store';
import { ZetkinPersonEmailChannelPreference } from '../types';

export default function usePersonEmailChannelPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return useCallback(
    async (mute: boolean, channelId: number) => {
      if (mute) {
        const preference =
          await apiClient.patch<ZetkinPersonEmailChannelPreference>(
            `/api2/orgs/${orgId}/people/${personId}/email_preferences/channels/${channelId}`,
            { status: 'channel_muted' }
          );
        dispatch(personChannelPreferenceUpdated([personId, preference]));
      } else {
        await apiClient.delete(
          `/api2/orgs/${orgId}/people/${personId}/email_preferences/channels/${channelId}`
        );

        dispatch(personChannelPreferencesInvalidated(personId));
      }
    },
    [apiClient, dispatch, orgId, personId]
  );
}
