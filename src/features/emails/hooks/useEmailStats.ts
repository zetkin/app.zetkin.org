import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';

import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import useEmail from './useEmail';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export interface EmailStats {
  id: number;
  num_target_matches: number;
  num_locked_targets: number | null;
  num_blocked: {
    any: number;
    blacklisted: number;
    no_email: number;
    unsubscribed: number;
  };
}

export default function useEmailStats(
  orgId: number,
  emailId: number
): IFuture<EmailStats> {
  const { isTargeted } = useEmail(orgId, emailId);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector((state) => state.emails.statsById[emailId]);

  const statsFuture = loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<EmailStats & { id: number }>(
        `/api/orgs/${orgId}/emails/${emailId}/stats`
      );
      return { ...data, id: emailId };
    },
  });

  if (!isTargeted) {
    return new ResolvedFuture(null);
  }
  if (statsFuture.isLoading && !statsFuture.data) {
    return new PlaceholderFuture({
      id: emailId,
      num_blocked: {
        any: 0,
        blacklisted: 0,
        no_email: 0,
        unsubscribed: 0,
      },
      num_locked_targets: 0,
      num_target_matches: 0,
    });
  } else {
    return statsFuture;
  }
}
