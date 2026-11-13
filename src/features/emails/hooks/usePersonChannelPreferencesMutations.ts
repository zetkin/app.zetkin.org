import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  personChannelPreferencesInvalidated,
  personChannelPreferenceUpdated,
} from '../store';
import {
  ZetkinPersonChannelPreference,
  ZetkinPersonChannelPreferencePatchBody,
} from '../types';

type UsePersonChannelPreferencesMutationsReturn = {
  clearSubscribeFromChannel: (channelId: number) => Promise<void>;
  muteChannel: (channelId: number) => Promise<void>;
  subscribeToChannel: (channelId: number) => Promise<void>;
  unmuteChannel: (channelId: number) => Promise<void>;
};

export default function usePersonChannelPreferencesMutations(
  orgId: number,
  personId: number
): UsePersonChannelPreferencesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const setChannelStatus = useCallback(
    async (
      channelId: number,
      status: ZetkinPersonChannelPreferencePatchBody['status']
    ) => {
      const preference = await apiClient.patch<ZetkinPersonChannelPreference>(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences/channels/${channelId}`,
        { status }
      );
      dispatch(personChannelPreferenceUpdated([personId, preference]));
    },
    [apiClient, dispatch, orgId, personId]
  );

  const resetChannelStatus = useCallback(
    async (channelId: number) => {
      await apiClient.delete(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences/channels/${channelId}`
      );
      dispatch(personChannelPreferencesInvalidated(personId));
    },
    [apiClient, dispatch, orgId, personId]
  );

  return useMemo(
    () => ({
      clearSubscribeFromChannel: (channelId) => resetChannelStatus(channelId),
      muteChannel: (channelId) => setChannelStatus(channelId, 'channel_muted'),
      subscribeToChannel: (channelId) =>
        setChannelStatus(channelId, 'subscribed'),
      unmuteChannel: async (channelId) => resetChannelStatus(channelId),
    }),
    [resetChannelStatus, setChannelStatus]
  );
}
