import { useApiClient, useAppDispatch } from 'core/hooks';
import useUser from 'core/hooks/useUser';
import { personChannelPreferenceUpdated, personOrgMuteUpdated } from '../store';

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const userId = useUser()?.id ?? null;

  const channelUrl = (channelId: number) =>
    `/api2/orgs/${orgId}/channels/${channelId}/preferences/${personId}`;
  const orgMuteUrl = `/api2/orgs/${orgId}/people/${personId}/email_preferences/mute`;

  return {
    async muteChannel(channelId: number) {
      await apiClient.put(`${channelUrl(channelId)}/mute`);
      dispatch(
        personChannelPreferenceUpdated([personId, channelId, 'muted', userId])
      );
    },
    async muteOrg() {
      await apiClient.put(orgMuteUrl);
      dispatch(personOrgMuteUpdated([personId, true, userId]));
    },
    async subscribeToChannel(channelId: number) {
      await apiClient.put(`${channelUrl(channelId)}/subscribe`);
      dispatch(
        personChannelPreferenceUpdated([
          personId,
          channelId,
          'subscribed',
          userId,
        ])
      );
    },
    async unmuteChannel(channelId: number) {
      await apiClient.delete(`${channelUrl(channelId)}/mute`);
      dispatch(
        personChannelPreferenceUpdated([
          personId,
          channelId,
          'received',
          userId,
        ])
      );
    },
    async unmuteOrg() {
      await apiClient.delete(orgMuteUrl);
      dispatch(personOrgMuteUpdated([personId, false, userId]));
    },
  };
}
