import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';

export interface DateStats {
  date: string;
  calls: number;
  conversations: number;
}

export interface ZetkinCaller {
  id: number;
  name: string;
}

interface ZetkinCall {
  allocation_time: string;
  caller: ZetkinCaller;
  state: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { assignment, caller, org } = req.query;

  const apiFetch = createApiFetch(req.headers);

  const callsRes = await apiFetch(
    `/orgs/${org}/call_assignments/${assignment}/calls`
  );
  const callsData = await callsRes.json();
  const sortedCalls: ZetkinCall[] = callsData.data.sort(
    (c0: ZetkinCall, c1: ZetkinCall) => {
      return (
        new Date(c0.allocation_time).getTime() -
        new Date(c1.allocation_time).getTime()
      );
    }
  );

  const dates: DateStats[] = [];

  const lastDate = new Date(
    sortedCalls[sortedCalls.length - 1].allocation_time
  );

  // Extend timeframe backwards to at least 14 days
  let firstDate = new Date(sortedCalls[0].allocation_time);
  if (lastDate.getTime() - firstDate.getTime() < 14 * 24 * 60 * 60 * 1000) {
    firstDate = new Date(lastDate);
    firstDate.setDate(firstDate.getDate() - 14);
  }

  const callerIds: Set<number> = new Set();
  const callers: ZetkinCaller[] = [];

  let callIdx = 0;
  const curDate = firstDate;
  while (curDate <= lastDate) {
    const dateStats: DateStats = {
      calls: 0,
      conversations: 0,
      date: curDate.toISOString().slice(0, 10),
    };

    dates.push(dateStats);

    while (callIdx < sortedCalls.length) {
      const curCall = sortedCalls[callIdx];
      const curCallDateStr = curCall.allocation_time.slice(0, 10);

      if (curCallDateStr != dateStats.date) {
        break;
      }

      // Add caller if not seen before
      if (!callerIds.has(curCall.caller.id)) {
        callers.push(curCall.caller);
        callerIds.add(curCall.caller.id);
      }

      // Skip calls that are just allocated
      if (curCall.state == 0) {
        callIdx++;
        continue;
      }

      // Skip calls belonging to wrong caller
      if (caller && curCall.caller.id.toString() !== caller) {
        callIdx++;
        continue;
      }

      // Add stats
      dateStats.calls++;
      if (curCall.state == 1) {
        dateStats.conversations++;
      }

      callIdx++;
    }

    curDate.setDate(curDate.getDate() + 1);
  }

  res.status(200).json({
    callers,
    dates,
  });
}
