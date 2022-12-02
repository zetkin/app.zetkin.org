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

  const targetsRes = await apiFetch(
    `/orgs/${org}/call_assignments/${assignment}/targets`
  );
  const targetsData = await targetsRes.json();

  const blockedTargets = targetsData.data.filter(
    (target: ZetkinTarget) => target.status.block_reasons.length > 0
  );

  let allocated = 0,
    callBackLater = 0,
    calledTooRecently = 0,
    doneButBlocked = 0,
    missingPhoneNumber = 0,
    organizerActionNeeded = 0;

  blockedTargets.forEach((target: ZetkinTarget) => {
    if (target.status.goal_fulfilled) {
      doneButBlocked++;
    }

    const reasons = target.status.block_reasons;
    if (reasons.includes('organizer_action_needed')) {
      organizerActionNeeded++;
    } else if (reasons.includes('no_number')) {
      missingPhoneNumber++;
    } else if (reasons.includes('call_back_after')) {
      callBackLater++;
    } else if (reasons.includes('cooldown')) {
      calledTooRecently++;
    } else if (reasons.includes('allocated')) {
      allocated++;
    }
  });

  const blocked: number =
    callBackLater +
    calledTooRecently +
    missingPhoneNumber +
    organizerActionNeeded;

  const done: number =
    statsData.data.num_target_matches -
    statsData.data.num_remaining_targets -
    doneButBlocked;

  const ready: number = statsData.data.num_target_matches + allocated - done;

  const queue: number = ready - allocated;

  const allTargets: number = blocked + ready + done;

  res.status(200).json({
    data: {
      allTargets,
      allocated,
      blocked,
      callBackLater,
      calledTooRecently,
      done,
      missingPhoneNumber,
      organizerActionNeeded,
      queue,
      ready,
    },
  });
}
