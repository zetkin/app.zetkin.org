import { useApiClient, useAppDispatch } from 'core/hooks';
import { personEmailPreferencesInvalidated } from '../store';
import { ZetkinChannelStatus } from '../types';

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const preferencesUrl = `/api2/orgs/${orgId}/people/${personId}/email_preferences`;

  return {
    async setChannelStatus(channelId: number, status: ZetkinChannelStatus) {
      await apiClient.patch(`${preferencesUrl}/channels/${channelId}`, {
        status,
      });
      dispatch(personEmailPreferencesInvalidated(personId));
    },
    async setOrgMuted(muted: boolean) {
      await apiClient.patch(preferencesUrl, { org_muted: muted });
      dispatch(personEmailPreferencesInvalidated(personId));
    },
  };
}
