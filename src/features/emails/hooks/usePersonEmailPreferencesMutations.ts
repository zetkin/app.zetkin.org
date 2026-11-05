import { useApiClient, useAppDispatch } from 'core/hooks';
import { personEmailPreferencesInvalidated } from '../store';

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const channelUrl = (channelId: number) =>
    `/api2/orgs/${orgId}/channels/${channelId}/preferences/${personId}`;
  const orgMuteUrl = `/api2/orgs/${orgId}/people/${personId}/email_preferences/mute`;

  return {
    async muteChannel(channelId: number) {
      await apiClient.put(`${channelUrl(channelId)}/mute`);
      dispatch(personEmailPreferencesInvalidated(personId));
    },
    async muteOrg() {
      await apiClient.put(orgMuteUrl);
      dispatch(personEmailPreferencesInvalidated(personId));
    },
    async subscribeToChannel(channelId: number) {
      await apiClient.put(`${channelUrl(channelId)}/subscribe`);
      dispatch(personEmailPreferencesInvalidated(personId));
    },
    async unmuteChannel(channelId: number) {
      await apiClient.delete(`${channelUrl(channelId)}/mute`);
      dispatch(personEmailPreferencesInvalidated(personId));
    },
    async unmuteOrg() {
      await apiClient.delete(orgMuteUrl);
      dispatch(personEmailPreferencesInvalidated(personId));
    },
  };
}
