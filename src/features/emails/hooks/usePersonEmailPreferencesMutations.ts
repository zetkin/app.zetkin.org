import { useCallback } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { personOrgEmailPreferencesLoaded } from '../store';
import {
  ZetkinPersonOrgEmailPreferences,
  ZetkinPersonOrgEmailPreferencesPatchBody,
} from '../types';

export default function usePersonOrgEmailPreferencesMutations(
  orgId: number,
  personId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return useCallback(
    async (mute: boolean) => {
      const preferences = await apiClient.patch<
        ZetkinPersonOrgEmailPreferences,
        ZetkinPersonOrgEmailPreferencesPatchBody
      >(`/api2/orgs/${orgId}/people/${personId}/email_preferences`, {
        org_status: mute ? 'muted' : 'unmuted',
      });
      dispatch(personOrgEmailPreferencesLoaded([personId, preferences]));
    },
    [apiClient, dispatch, orgId, personId]
  );
}
