import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCallAssignment,
  ZetkinSmartSearchFilter,
  ZetkinSubOrganization,
  ZetkinSurvey,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgWithStats } from '../types';
import { ZetkinCall } from 'features/call/types';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;

export type Result = SuborgWithStats[];

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

  const suborgsWithStats: SuborgWithStats[] = [];

  const activeSuborgs = suborgs.filter((suborg) => suborg.is_active);

  for (const suborg of activeSuborgs) {
    const suborgStats = await apiClient.post<
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
    });

    const numPeople = suborgStats[0].result;

    const callAssignments = await apiClient.get<ZetkinCallAssignment[]>(
      `/api/orgs/${suborg.id}/call_assignments?recursive`
    );

    const calls = await apiClient.get<ZetkinCall[]>(
      `/api/orgs/${suborg.id}/calls?recursive`
    );

    const surveys = await apiClient.get<ZetkinSurvey[]>(
      `/api/orgs/${suborg.id}/surveys?recursive`
    );

    const surveySubmissions = await apiClient.get<ZetkinSurveySubmission[]>(
      `/api/orgs/${suborg.id}/survey_submissions?recursive`
    );

    suborgsWithStats.push({
      id: suborg.id,
      stats: {
        numCallAssignments: callAssignments.length,
        numCalls: calls.length,
        numPeople,
        numSubmissions: surveySubmissions.length,
        numSurveys: surveys.length,
      },
      title: suborg.title,
    });
  }

  return suborgsWithStats;
}
