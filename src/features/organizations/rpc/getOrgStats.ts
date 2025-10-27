import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCampaign,
  ZetkinEmail,
  ZetkinEvent,
  ZetkinSmartSearchFilter,
  ZetkinSurveySubmission,
  ZetkinView,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { ZetkinCall } from 'features/call/types';
import { ZetkinEmailStats } from 'features/emails/types';
import getEventStats from 'features/events/rpc/getEventStats';
import { OrgStats } from '../types';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;

export type Result = OrgStats;

export const getOrgStatsDef = {
  handler: handle,
  name: 'getOrgStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getOrgStatsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;

  const now = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30))
    .toISOString()
    .slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const [
    orgStats,
    eventParticipationStats,
    calls,
    surveySubmissions,
    lists,
    projects,
    events,
    emails,
  ] = await Promise.all([
    apiClient.post<
      ZetkinSmartSearchFilterStats[],
      { filter_spec: ZetkinSmartSearchFilter[] }
    >(`/api/orgs/${orgId}/people/queries/ephemeral/stats`, {
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
    >(`/api/orgs/${orgId}/people/queries/ephemeral/stats`, {
      filter_spec: [
        {
          config: {
            after: '-30d',
            operator: 'in',
            organizations: [orgId],
            state: 'booked',
          },
          op: OPERATION.ADD,
          type: FILTER_TYPE.CAMPAIGN_PARTICIPATION,
        },
      ],
    }),
    apiClient.get<ZetkinCall[]>(`/api/orgs/${orgId}/calls`),
    apiClient.get<ZetkinSurveySubmission[]>(
      `/api/orgs/${orgId}/survey_submissions`
    ),
    apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`),
    apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns`),
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/actions?filter=start_time>=${thirtyDaysAgo}&filter=end_time<=${today}`
    ),
    apiClient.get<ZetkinEmail[]>(`/api/orgs/${orgId}/emails`),
  ]);

  let numEventsWithParticipants = 0;

  for (const event of events) {
    const eventStats = await apiClient.rpc(getEventStats, {
      eventId: event.id,
      orgId: event.organization.id,
    });

    if (eventStats.numBooked > 0) {
      numEventsWithParticipants++;
    }
  }
  const thirtyDaysAgoDate = new Date(thirtyDaysAgo);

  let numEmailsSent = 0;
  for (const email of emails) {
    if (email.published) {
      const sendTime = new Date(email.published);

      if (sendTime >= thirtyDaysAgoDate && sendTime <= now) {
        const stats = await apiClient.get<ZetkinEmailStats>(
          `/api/orgs/${email.organization.id}/emails/${email.id}/stats`
        );
        numEmailsSent = numEmailsSent + stats.num_sent;
      }
    }
  }

  const numCalls = calls.filter(
    (call) => new Date(call.allocation_time) >= thirtyDaysAgoDate
  ).length;
  const numEventParticipants = eventParticipationStats[0].result;
  const numLists = lists.length;
  const numPeople = orgStats[0].result;
  const numProjects = projects.length;
  const numSubmissions = surveySubmissions.filter(
    (submission) => new Date(submission.submitted) >= thirtyDaysAgoDate
  ).length;

  return {
    numCalls,
    numEmailsSent,
    numEventParticipants,
    numEventsWithParticipants,
    numLists,
    numPeople,
    numProjects,
    numSubmissions,
  };
}
