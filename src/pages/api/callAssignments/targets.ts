import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

export interface ZetkinTarget {
  status: {
    block_reasons: string[];
    blocked: boolean;
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

  const allocated: number = targetsData.data.filter((target: ZetkinTarget) =>
    target.status.block_reasons.includes('allocated')
  ).length;
  const blocked: number =
    targetsData.data.filter((target: ZetkinTarget) => target.status.blocked)
      .length - allocated;
  const done: number =
    statsData.data.num_target_matches - statsData.data.num_remaining_targets;
  const ready: number = statsData.data.num_target_matches + allocated - done;

  res.status(200).json({
    blocked,
    done,
    ready,
  });
}
