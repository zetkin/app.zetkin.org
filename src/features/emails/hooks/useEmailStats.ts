import useEmail from './useEmail';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinEmailStats } from '../types';
import useRemoteItem from 'core/hooks/useRemoteItem';

interface UseEmailStatsReturn {
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
  rawStats: ZetkinEmailStats | null;
}

export default function useEmailStats(
  orgId: number,
  emailId: number
): UseEmailStatsReturn {
  const { isTargeted } = useEmail(orgId, emailId);
  const apiClient = useApiClient();
  const statsItem = useAppSelector((state) => state.emails.statsById[emailId]);

  const stats = useRemoteItem(statsItem, {
    actionOnLoad: () => statsLoad(emailId),
    actionOnSuccess: (data) => statsLoaded(data),
    loader: async () => {
      const data = await apiClient.get<ZetkinEmailStats & { id: number }>(
        `/api/orgs/${orgId}/emails/${emailId}/stats`
      );
      return { ...data, id: emailId };
    },
  });

  const statsData = isTargeted ? stats : null;

  const allTargetMatches = statsData?.num_target_matches ?? 0;
  const allLocked = statsData?.num_locked_targets ?? null;
  const allBlocked = statsData?.num_blocked.any ?? 0;
  const lockedReadyTargets = allLocked === null ? null : allLocked - allBlocked;
  const readyTargets = allTargetMatches - allBlocked;

  return {
    lockedReadyTargets,
    numBlocked: {
      any: statsData?.num_blocked.any ?? 0,
      blacklisted: statsData?.num_blocked.blacklisted ?? 0,
      noEmail: statsData?.num_blocked.no_email ?? 0,
      unsubscribed: statsData?.num_blocked.unsubscribed ?? 0,
    },
    numClicked: statsData?.num_clicks ?? 0,
    numLockedTargets: statsData?.num_locked_targets ?? 0,
    numOpened: statsData?.num_opened ?? 0,
    numSent: statsData?.num_sent ?? 0,
    numTargetMatches: statsData?.num_target_matches ?? 0,
    rawStats: statsData,
    readyTargets,
  };
}
