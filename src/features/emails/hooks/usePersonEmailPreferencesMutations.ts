import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { personEmailPreferencesLoaded } from '../store';
import {
  ZetkinOrgEmailPreferenceStatus,
  ZetkinPersonEmailPreferences,
} from '../types';

type UsePersonEmailPreferencesMutationsReturn = {
  setOrgMuted: (muted: boolean) => Promise<void>;
};

export default function usePersonEmailPreferencesMutations(
  orgId: number,
  personId: number
): UsePersonEmailPreferencesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const setOrgStatus = useCallback(
    async (status: ZetkinOrgEmailPreferenceStatus) => {
      const preferences = await apiClient.patch<ZetkinPersonEmailPreferences>(
        `/api2/orgs/${orgId}/people/${personId}/email_preferences`,
        { org_status: status }
      );
      dispatch(personEmailPreferencesLoaded([personId, preferences]));
    },
    [apiClient, dispatch, orgId, personId]
  );

  return useMemo(
    () => ({
      setOrgMuted: (muted) => setOrgStatus(muted ? 'muted' : 'unmuted'),
    }),
    [setOrgStatus]
  );
}
