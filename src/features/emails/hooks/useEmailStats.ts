import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';

import useEmail from './useEmail';

interface EmailStats {
  num_target_matches: number;
  num_target_locked: number | null;
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

  //TODO: Get real stats from API
  const statsFuture = {
    data: {
      num_blocked: {
        any: 70,
        blacklisted: 10,
        no_email: 40,
        unsubscribed: 20,
      },
      num_target_locked: null,
      num_target_matches: 230,
    },
    error: false,
    isLoading: false,
  };

  if (!isTargeted) {
    return new ResolvedFuture(null);
  }
  if (statsFuture.isLoading && !statsFuture.data) {
    return new PlaceholderFuture({
      num_blocked: {
        any: 0,
        blacklisted: 0,
        no_email: 0,
        unsubscribed: 0,
      },
      num_target_locked: 0,
      num_target_matches: 0,
    });
  } else {
    return statsFuture;
  }
}
