import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCampaign,
  ZetkinEmail,
  ZetkinEvent,
  ZetkinOrganization,
  ZetkinSmartSearchFilter,
  ZetkinSubOrganization,
  ZetkinSurveySubmission,
  ZetkinView,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgLoadingError, SuborgWithFullStats } from '../types';
import { ZetkinCall } from 'features/call/types';
import { ZetkinEmailStats } from 'features/emails/types';
import getEventStats from 'features/events/rpc/getEventStats';

const paramsSchema = z.object({
  orgId: z.number(),
});

type Params = z.infer<typeof paramsSchema>;

export type Result = SuborgWithFullStats | SuborgLoadingError;

export const getSuborgWithStatsDef = {
  handler: handle,
  name: 'getSuborgWithStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getSuborgWithStatsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId } = params;

  const now = new Date();
  const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
  const today = now.toISOString().slice(0, 10);

  const results = await Promise.allSettled([
    apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
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
    apiClient.get<ZetkinCall[]>(`/api/orgs/${orgId}/calls?recursive`),
    apiClient.get<ZetkinSurveySubmission[]>(
      `/api/orgs/${orgId}/survey_submissions?recursive`
    ),
    apiClient.get<ZetkinView[]>(`/api/orgs/${orgId}/people/views?recursive`),
    apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns?recursive`),
    apiClient.get<ZetkinEvent[]>(
      `/api/orgs/${orgId}/actions?recursive&filter=start_time>=${thirtyDaysAgo
        .toISOString()
        .slice(0, 10)}&filter=end_time<=${today}`
    ),
  ]);

  if (results.some((result) => result.status == 'rejected')) {
    return {
      error: true,
      id: orgId,
    };
  }

  const [
    organization,
    suborgStats,
    calls,
    surveySubmissions,
    lists,
    projects,
    events,
  ] = results;

  const numBookedByEventStartDate: Record<string, number> = {};
  if (events.status == 'fulfilled') {
    for (let i = 0; i < 30; i++) {
      const date = new Date(new Date().setDate(now.getDate() - (30 - i)))
        .toISOString()
        .slice(0, 10);
      numBookedByEventStartDate[date] = 0;
    }

    for (const event of events.value) {
      const eventStats = await apiClient.rpc(getEventStats, {
        eventId: event.id,
        orgId: event.organization.id,
      });

      if (eventStats.numBooked > 0) {
        numBookedByEventStartDate[event.start_time.slice(0, 10)] =
          eventStats.numBooked;
      }
    }
  }

  //TODO: Add call to /emails with "recursive" flag in Promise.all above
  //once the API supports "recursive" flag for emails.
  const emailsInThisSuborg = await apiClient.get<ZetkinEmail[]>(
    `/api/orgs/${orgId}/emails`
  );
  const allSuborgsOfThisSuborg = await apiClient.get<ZetkinSubOrganization[]>(
    `/api/orgs/${orgId}/sub_organizations?recursive`
  );
  const allActiveSuborgsOfThisSuborg = allSuborgsOfThisSuborg.filter(
    (s) => s.is_active && s.id != orgId
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
    if (email.published) {
      const sendTime = new Date(email.published);

      if (sendTime >= thirtyDaysAgo && sendTime <= now) {
        const stats = await apiClient.get<ZetkinEmailStats>(
          `/api/orgs/${email.organization.id}/emails/${email.id}/stats`
        );
        numEmailsSent = numEmailsSent + stats.num_sent;
      }
    }
  }

  const numCalls =
    calls.status == 'fulfilled'
      ? calls.value.filter(
          (call) => new Date(call.allocation_time) >= thirtyDaysAgo
        ).length
      : 0;
  const numLists = lists.status == 'fulfilled' ? lists.value.length : 0;
  const numPeople =
    suborgStats.status == 'fulfilled' ? suborgStats.value[0].result : 0;
  const numProjects =
    projects.status == 'fulfilled' ? projects.value.length : 0;
  const numSubmissions =
    surveySubmissions.status == 'fulfilled'
      ? surveySubmissions.value.filter(
          (submission) => new Date(submission.submitted) >= thirtyDaysAgo
        ).length
      : 0;
  const title =
    organization.status == 'fulfilled' ? organization.value.title : '';

  return {
    id: orgId,
    stats: {
      numBookedByEventStartDate,
      numCalls,
      numEmailsSent,
      numLists,
      numPeople,
      numProjects,
      numSubmissions,
    },
    title,
  };
}
