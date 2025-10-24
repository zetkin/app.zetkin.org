import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCampaign,
  ZetkinEmail,
  ZetkinEvent,
  ZetkinSmartSearchFilter,
  ZetkinSubOrganization,
  ZetkinSurveySubmission,
  ZetkinView,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgResult } from '../types';
import { ZetkinCall } from 'features/call/types';
import { ZetkinEmailStats } from 'features/emails/types';

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
  const today = now.toISOString().slice(0, 10);

  const suborgPromises = activeSuborgs.map(async (suborg) => {
    const [
      suborgStats,
      eventParticipationStats,
      calls,
      surveySubmissions,
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
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${suborg.id}/actions?recursive&filter=start_time>=${thirtyDaysAgo}&filter=start_time<=${today}`
      ),
      apiClient.get<ZetkinView[]>(
        `/api/orgs/${suborg.id}/people/views?recursive`
      ),
      apiClient.get<ZetkinCampaign[]>(
        `/api/orgs/${suborg.id}/campaigns?recursive`
      ),
    ]);

    //TODO: Add call to /emails with "recursive" flag in Promise.all above
    //once the API supports "recursive" flag for emails.
    const emailsInThisSuborg = await apiClient.get<ZetkinEmail[]>(
      `/api/orgs/${suborg.id}/emails`
    );
    const allSuborgsOfThisSuborg = await apiClient.get<ZetkinSubOrganization[]>(
      `/api/orgs/${suborg.id}/sub_organizations?recursive`
    );
    const allActiveSuborgsOfThisSuborg = allSuborgsOfThisSuborg.filter(
      (s) => s.is_active && s.id != suborg.id
    );

    const emails: ZetkinEmail[] = [];
    emails.push(...emailsInThisSuborg);
    for (const s of allActiveSuborgsOfThisSuborg) {
      const suborgEmails = await apiClient.get<ZetkinEmail[]>(
        `/api/orgs/${s.id}/emails`
      );
      emails.push(...suborgEmails);
    }

    let numEmailsSent = 0;
    for (const email of emails) {
      const stats = await apiClient.get<ZetkinEmailStats>(
        `/api/orgs/${email.organization.id}/emails/${email.id}/stats`
      );
      numEmailsSent = numEmailsSent + stats.num_sent;
    }
    const numPeople = suborgStats[0].result;
    const numEventParticipants = eventParticipationStats[0].result;

    const thirtyDaysAgoDate = new Date(thirtyDaysAgo);

    return {
      id: suborg.id,
      stats: {
        numCalls: calls.filter(
          (call) => new Date(call.allocation_time) >= thirtyDaysAgoDate
        ).length,
        numEmailsSent,
        numEventParticipants,
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
  return await Promise.all(
    suborgPromises.map((promise, index) =>
      promise.catch(() => ({ error: true, id: `error-${index}` }))
    )
  );
}
