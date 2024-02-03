import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';

export interface ZetkinTarget {
  status: {
    block_reasons: string[];
    blocked: boolean;
    goal_fulfilled: boolean;
  };
}

interface ZetkinCallAssignmentStats {
  num_blocked: {
    allocated: number;
    any: number;
    call_back_after: number;
    cooldown: number;
    no_number: number;
    organizer_action_needed: number;
  };
  num_target_matches: number;
  num_goal_matches: number;
  num_remaining_targets: number;
  num_calls_made: number;
  num_calls_reached: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { org, assignment } = req.query;

  const client = new BackendApiClient(req.headers);

  const stats = await client.get<ZetkinCallAssignmentStats>(
    `/api/orgs/${org}/call_assignments/${assignment}/stats`
  );

  let mostRecentCallTime: string | null = null;
  const calls = await client.get<{ allocation_time: string }[]>(
    `/api/orgs/${org}/call_assignments/${assignment}/calls?pp=1&p=0`
  );
  if (calls.length) {
    mostRecentCallTime = calls[0].allocation_time;
  }

  res.status(200).json({
    data: {
      allTargets: stats.num_target_matches,
      allocated: stats.num_blocked.allocated,
      blocked: stats.num_blocked.any - stats.num_blocked.allocated,
      callBackLater: stats.num_blocked.call_back_after,
      calledTooRecently: stats.num_blocked.cooldown,
      callsMade: stats.num_calls_made,
      done: stats.num_target_matches - stats.num_remaining_targets,
      missingPhoneNumber: stats.num_blocked.no_number,
      mostRecentCallTime,
      organizerActionNeeded: stats.num_blocked.organizer_action_needed,
      queue: stats.num_remaining_targets - stats.num_blocked.any,
      ready:
        stats.num_remaining_targets -
        stats.num_blocked.any +
        stats.num_blocked.allocated,
    },
  });
}
