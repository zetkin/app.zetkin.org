import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinSmartSearchFilter,
  ZetkinSubOrganization,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgResult } from '../types';
import { ZetkinCall } from 'features/call/types';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;

export type Result = SuborgResult[];

export const getSuborgsWithStatsDef = {
  handler: handle,
  name: 'getSuborgsWithStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getSuborgsWithStatsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;

  const suborgs = await apiClient.get<ZetkinSubOrganization[]>(
    `/api/orgs/${orgId}/sub_organizations`
  );

  const activeSuborgs = suborgs.filter((suborg) => suborg.is_active);

  const now = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30))
    .toISOString()
    .slice(0, 10);

  const suborgPromises = activeSuborgs.map(async (suborg) => {
    const results = await Promise.allSettled([
      apiClient.post<
        ZetkinSmartSearchFilterStats[],
        { filter_spec: ZetkinSmartSearchFilter[] }
      >(`/api/orgs/${suborg.id}/people/queries/ephemeral/stats`, {
        filter_spec: [
          {
            config: {},
            op: OPERATION.ADD,
            type: FILTER_TYPE.ALL,
          },
        ],
      }),
      apiClient.post<
        ZetkinSmartSearchFilterStats[],
        { filter_spec: ZetkinSmartSearchFilter[] }
      >(`/api/orgs/${suborg.id}/people/queries/ephemeral/stats`, {
        filter_spec: [
          {
            config: {
              after: '-30d',
              operator: 'in',
              organizations: [suborg.id],
              state: 'booked',
            },
            op: OPERATION.ADD,
            type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
          },
        ],
      }),
      apiClient.get<ZetkinCall[]>(`/api/orgs/${suborg.id}/calls?recursive`),
      apiClient.get<ZetkinSurveySubmission[]>(
        `/api/orgs/${suborg.id}/survey_submissions?recursive`
      ),
    ]);

    if (results.some((result) => result.status == 'rejected')) {
      return {
        error: true,
        id: suborg.id,
      };
    }

    const [suborgStats, eventParticipationStats, calls, surveySubmissions] =
      results;

    const thirtyDaysAgoDate = new Date(thirtyDaysAgo);
    const numCalls =
      calls.status == 'fulfilled'
        ? calls.value.filter(
            (call) => new Date(call.allocation_time) >= thirtyDaysAgoDate
          ).length
        : 0;
    const numBookedForEvents =
      eventParticipationStats.status == 'fulfilled'
        ? eventParticipationStats.value[0].result
        : 0;
    const numPeople =
      suborgStats.status == 'fulfilled' ? suborgStats.value[0].result : 0;
    const numSubmissions =
      surveySubmissions.status == 'fulfilled'
        ? surveySubmissions.value.filter(
            (submission) => new Date(submission.submitted) >= thirtyDaysAgoDate
          ).length
        : 0;

    return {
      id: suborg.id,
      stats: {
        numBookedForEvents,
        numCalls,
        numPeople,
        numSubmissions,
      },
      title: suborg.title,
    };
  });

  /***
   * This await is needed, although we expect to return a promsie.
   * Background: It otherwise would resolve the promises after sending it out somehow.
   * It caused the request to take 4 times compared to when awaiting it here
   ***/
  return await Promise.all(suborgPromises);
}
