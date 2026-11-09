import { useApiClient, useAppDispatch } from 'core/hooks';
import { personEmailPreferencesLoaded } from '../store';
import {
  ZetkinPersonChannelPreference,
  ZetkinPersonEmailPreferences,
} from '../types';

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const preferencesUrl = `/api2/orgs/${orgId}/people/${personId}/email_preferences`;

  const patch = async (url: string, data: Record<string, unknown>) => {
    const preferences = await apiClient.patch<
      ZetkinPersonEmailPreferences,
      Record<string, unknown>
    >(url, data);
    dispatch(personEmailPreferencesLoaded([personId, preferences]));
  };

  const setChannelStatus = (
    channelId: number,
    status: 'channel_muted' | 'has_received' | 'subscribed'
  ) => patch(`${preferencesUrl}/channels/${channelId}`, { status });

  return {
    muteChannel: (channelId: number) =>
      setChannelStatus(channelId, 'channel_muted'),
    setOrgMuted: (muted: boolean) =>
      patch(preferencesUrl, { org_muted: muted }),
    subscribeToChannel: (channelId: number) =>
      setChannelStatus(channelId, 'subscribed'),
    async unmuteChannel(channel: ZetkinPersonChannelPreference) {
      await setChannelStatus(channel.id, 'has_received');
      if (channel.subscribed && channel.published) {
        await setChannelStatus(channel.id, 'subscribed');
      }
    },
  };
}
