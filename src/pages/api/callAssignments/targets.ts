import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';

export interface ZetkinTarget {
  status: {
    block_reasons: string[];
    blocked: boolean;
  };
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
  const statsData = await statsRes.json();

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
  const done: number = statsData.data.num_goal_matches;
  const ready: number = statsData.data.num_target_matches + allocated - done;

  res.status(200).json({
    blocked,
    done,
    ready,
  });
}
