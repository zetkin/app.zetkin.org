import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

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

  const apiFetch = createApiFetch(req.headers);

  const statsRes = await apiFetch(
    `/orgs/${org}/call_assignments/${assignment}/stats`
  );
  const statsData = (await statsRes.json()) as {
    data: ZetkinCallAssignmentStats;
  };

  let mostRecentCallTime: string | null = null;
  const callsRes = await apiFetch(
    `/orgs/${org}/call_assignments/${assignment}/calls?pp=1&p=0`
  );
  const callsData = await callsRes.json();
  if (callsData.data.length) {
    mostRecentCallTime = callsData.data[0].allocation_time;
  }

  res.status(200).json({
    data: {
      allTargets: statsData.data.num_target_matches,
      allocated: statsData.data.num_blocked.allocated,
      blocked: statsData.data.num_blocked.any,
      callBackLater: statsData.data.num_blocked.call_back_after,
      calledTooRecently: statsData.data.num_blocked.cooldown,
      done:
        statsData.data.num_target_matches -
        statsData.data.num_remaining_targets,
      missingPhoneNumber: statsData.data.num_blocked.no_number,
      mostRecentCallTime,
      organizerActionNeeded: statsData.data.num_blocked.organizer_action_needed,
      queue:
        statsData.data.num_remaining_targets - statsData.data.num_blocked.any,
      ready:
        statsData.data.num_remaining_targets -
        statsData.data.num_blocked.any +
        statsData.data.num_blocked.allocated,
    },
  });
}
