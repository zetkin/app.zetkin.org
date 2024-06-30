import { NextApiRequest, NextApiResponse } from 'next';

import { createApiFetch } from 'utils/apiFetch';

export interface DateStats {
  date: string;
  calls: number;
  conversations: number;
}

interface ZetkinCaller {
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

  lastDate.setMinutes(60);

  // Start 48 hours before last hour
  const startDate = new Date(lastDate);
  startDate.setDate(lastDate.getDate() - 2);

  const callerIds: Set<number> = new Set();
  const callers: ZetkinCaller[] = [];

  let callIdx = 0;
  const curDate = startDate;
  curDate.setMinutes(0);
  curDate.setSeconds(0);
  curDate.setMilliseconds(0);

  while (curDate <= lastDate) {
    const dateStats: DateStats = {
      calls: 0,
      conversations: 0,
      date: curDate.toISOString().slice(0, 16),
    };

    dates.push(dateStats);

    while (callIdx < sortedCalls.length) {
      const curCall = sortedCalls[callIdx];
      const curCallDate = new Date(curCall.allocation_time);
      curCallDate.setMinutes(0);
      curCallDate.setSeconds(0);
      curCallDate.setMilliseconds(0);
      const curCallDateStr = curCallDate.toISOString().slice(0, 16);

      if (curCallDate < curDate) {
        callIdx++;
        continue;
      } else if (curCallDateStr != dateStats.date) {
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

    curDate.setHours(curDate.getHours() + 1);
  }

  res.status(200).json({
    callers,
    dates,
  });
}
