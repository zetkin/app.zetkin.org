import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCampaign,
  ZetkinEmail,
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinSmartSearchFilter,
  ZetkinSubOrganization,
  ZetkinSurveySubmission,
  ZetkinView,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgWithStats } from '../types';
import { ZetkinCall } from 'features/call/types';
import { ZetkinEmailStats } from 'features/emails/types';

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

  const activeSuborgs = suborgs.filter((suborg) => suborg.is_active);

  const now = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30))
    .toISOString()
    .slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const suborgPromises = activeSuborgs.map(async (suborg) => {
    const [
      suborgStats,
      calls,
      surveySubmissions,
      events,
      emails,
      lists,
      projects,
    ] = await Promise.all([
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
      apiClient.get<ZetkinCall[]>(`/api/orgs/${suborg.id}/calls?recursive`),
      apiClient.get<ZetkinSurveySubmission[]>(
        `/api/orgs/${suborg.id}/survey_submissions?recursive`
      ),
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${suborg.id}/actions?recursive&filter=start_time>=${thirtyDaysAgo}&filter=start_time<=${today}`
      ),
      //TODO: Add "recursive" flag once the API supports it for emails
      apiClient.get<ZetkinEmail[]>(`/api/orgs/${suborg.id}/emails`),
      apiClient.get<ZetkinView[]>(
        `/api/orgs/${suborg.id}/people/views?recursive`
      ),
      apiClient.get<ZetkinCampaign[]>(
        `/api/orgs/${suborg.id}/campaigns?recursive`
      ),
    ]);

    let numEventParticipants = 0;
    for (const event of events) {
      const participants = await apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${suborg.id}/actions/${event.id}/participants`
      );
      numEventParticipants = numEventParticipants + participants.length;
    }

    let numEmailsSent = 0;
    for (const email of emails) {
      const stats = await apiClient.get<ZetkinEmailStats>(
        `/api/orgs/${suborg.id}/emails/${email.id}/stats`
      );
      numEmailsSent = numEmailsSent + stats.num_sent;
    }
    const numPeople = suborgStats[0].result;

    const thirtyDaysAgoDate = new Date(thirtyDaysAgo);

    return {
      id: suborg.id,
      stats: {
        numCalls: calls.filter(
          (call) => new Date(call.allocation_time) >= thirtyDaysAgoDate
        ).length,
        numEmails: emails.length,
        numEmailsSent,
        numEventParticipants,
        numEvents: events.length,
        numLists: lists.length,
        numPeople,
        numProjects: projects.length,
        numSubmissions: surveySubmissions.filter(
          (submission) => new Date(submission.submitted) >= thirtyDaysAgoDate
        ).length,
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
