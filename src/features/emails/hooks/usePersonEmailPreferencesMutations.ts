import { useApiClient, useAppDispatch } from 'core/hooks';
import { personEmailPreferencesLoaded } from '../store';
import {
  ZetkinPersonChannelPreference,
  ZetkinPersonChannelPreferencePatchBody,
  ZetkinPersonEmailPreferences,
  ZetkinPersonEmailPreferencesPatchBody,
} from '../types';

type UsePersonEmailPreferencesMutationsReturn = {
  muteChannel: (channelId: number) => Promise<void>;
  setOrgMuted: (muted: boolean) => Promise<void>;
  subscribeToChannel: (channelId: number) => Promise<void>;
  unmuteChannel: (channel: ZetkinPersonChannelPreference) => Promise<void>;
  unsubscribeFromChannel: (channelId: number) => Promise<void>;
};

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
): UsePersonEmailPreferencesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const preferencesUrl = `/api2/orgs/${orgId}/people/${personId}/email_preferences`;

  const patch = async (
    url: string,
    data:
      | ZetkinPersonEmailPreferencesPatchBody
      | ZetkinPersonChannelPreferencePatchBody
  ) => {
    const preferences = await apiClient.patch<
      ZetkinPersonEmailPreferences,
      typeof data
    >(url, data);
    dispatch(personEmailPreferencesLoaded([personId, preferences]));
  };

  const setChannelStatus = (
    channelId: number,
    status: ZetkinPersonChannelPreferencePatchBody['status']
  ) => patch(`${preferencesUrl}/channels/${channelId}`, { status });

  return {
    muteChannel: (channelId) => setChannelStatus(channelId, 'channel_muted'),
    setOrgMuted: (muted) => patch(preferencesUrl, { org_muted: muted }),
    subscribeToChannel: (channelId) =>
      setChannelStatus(channelId, 'subscribed'),
    unmuteChannel: async (channel) => {
      // Setting has_received clears the mute. If the person was subscribed
      // before muting, subscribe them again.
      await setChannelStatus(channel.id, 'has_received');
      if (channel.subscribed && channel.published) {
        await setChannelStatus(channel.id, 'subscribed');
      }
    },
    unsubscribeFromChannel: (channelId) =>
      setChannelStatus(channelId, 'has_received'),
  };
}
