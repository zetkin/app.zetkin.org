import { PlaceholderFuture, ResolvedFuture } from 'core/caching/futures';
import { futureToObject } from 'core/caching/futures';
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
  num_sent: number;
  num_opened: number;
  num_clicked: number;
}

interface UseEmailStatsReturn {
  data: EmailStats | null;
  error: unknown | null;
  isLoading: boolean;
  lockedReadyTargets: number | null;
  numTargetMatches: number;
  numLockedTargets: number | null;
  numBlocked: {
    any: number;
    blacklisted: number;
    noEmail: number;
    unsubscribed: number;
  };
  numSent: number;
  numOpened: number;
  numClicked: number;
  readyTargets: number;
}

export default function useEmailStats(
  orgId: number,
  emailId: number
): UseEmailStatsReturn {
  const { isTargeted } = useEmail(orgId, emailId);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector((state) => state.emails.statsById[emailId]);

  let statsFuture = loadItemIfNecessary(statsItem, dispatch, {
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
    statsFuture = new ResolvedFuture(null);
  }

  if (statsFuture.isLoading && !statsFuture.data) {
    statsFuture = new PlaceholderFuture({
      id: emailId,
      num_blocked: {
        any: 0,
        blacklisted: 0,
        no_email: 0,
        unsubscribed: 0,
      },
      num_clicked: 0,
      num_locked_targets: 0,
      num_opened: 0,
      num_sent: 0,
      num_target_matches: 0,
    });
  }

  const allTargetMatches = statsFuture.data?.num_target_matches ?? 0;
  const allLocked = statsFuture.data?.num_locked_targets ?? null;
  const allBlocked = statsFuture.data?.num_blocked.any ?? 0;
  const lockedReadyTargets = allLocked === null ? null : allLocked - allBlocked;
  const readyTargets = allTargetMatches - allBlocked;

  return {
    ...futureToObject(statsFuture),
    lockedReadyTargets,
    numBlocked: {
      any: statsFuture.data?.num_blocked.any ?? 0,
      blacklisted: statsFuture.data?.num_blocked.blacklisted ?? 0,
      noEmail: statsFuture.data?.num_blocked.no_email ?? 0,
      unsubscribed: statsFuture.data?.num_blocked.unsubscribed ?? 0,
    },
    numClicked: statsFuture.data?.num_clicked ?? 0,
    numLockedTargets: statsFuture.data?.num_locked_targets ?? 0,
    numOpened: statsFuture.data?.num_opened ?? 0,
    numSent: statsFuture.data?.num_sent ?? 0,
    numTargetMatches: statsFuture.data?.num_target_matches ?? 0,
    readyTargets,
  };
}
