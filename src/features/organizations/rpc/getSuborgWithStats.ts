import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCampaign,
  ZetkinEvent,
  ZetkinOrganization,
  ZetkinSmartSearchFilter,
  ZetkinSurveySubmission,
  ZetkinView,
} from 'utils/types/zetkin';
import { ZetkinSmartSearchFilterStats } from 'features/smartSearch/types';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import { SuborgLoadingError, SuborgWithFullStats } from '../types';
import { ZetkinCall } from 'features/call/types';
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

  if (results.some((result) => result.status === 'rejected')) {
    return {
      error: true,
      id: orgId,
    };
  }

  const [
    organization,
    suborgStats,
    eventParticipationStats,
    calls,
    surveySubmissions,
    lists,
    projects,
    events,
  ] = results;

  let numEventsWithBookedPeople = 0;
  const numBookedByEventsByStartDate: Record<string, number> = {};
  if (events.status === 'fulfilled') {
    for (let i = 0; i < 30; i++) {
      const date = new Date(new Date().setDate(now.getDate() - (30 - i)))
        .toISOString()
        .slice(0, 10);
      numBookedByEventsByStartDate[date] = 0;
    }

    for (const event of events.value) {
      const eventStats = await apiClient.rpc(getEventStats, {
        eventId: event.id,
        orgId: event.organization.id,
      });

      if (eventStats.numBooked > 0) {
        numEventsWithBookedPeople++;
        const eventStartDate = event.start_time.slice(0, 10);
        numBookedByEventsByStartDate[eventStartDate] =
          numBookedByEventsByStartDate[eventStartDate] + eventStats.numBooked;
      }
    }
  }

  let numCalls = 0;
  const numCallsByCallDate: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const date = new Date(new Date().setDate(now.getDate() - (30 - i)))
      .toISOString()
      .slice(0, 10);
    numCallsByCallDate[date] = 0;
  }

  if (calls.status === 'fulfilled') {
    for (const call of calls.value) {
      const allocationTime = new Date(call.allocation_time);
      if (allocationTime >= thirtyDaysAgo) {
        numCalls++;
        const callDate = allocationTime.toISOString().slice(0, 10);
        numCallsByCallDate[callDate] = numCallsByCallDate[callDate] + 1;
      }
    }
  }

  let numSubmissions = 0;
  const numSubmissionsBySubmitDate: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const date = new Date(new Date().setDate(now.getDate() - (30 - i)))
      .toISOString()
      .slice(0, 10);
    numSubmissionsBySubmitDate[date] = 0;
  }

  if (surveySubmissions.status === 'fulfilled') {
    for (const submission of surveySubmissions.value) {
      const submitTime = new Date(submission.submitted);
      if (submitTime >= thirtyDaysAgo) {
        numSubmissions++;
        const submitDate = submitTime.toISOString().slice(0, 10);
        numSubmissionsBySubmitDate[submitDate] =
          numSubmissionsBySubmitDate[submitDate] + 1;
      }
    }
  }

  const numLists = lists.status === 'fulfilled' ? lists.value.length : 0;
  const numPeople =
    suborgStats.status === 'fulfilled' ? suborgStats.value[0].result : 0;
  const numProjects =
    projects.status === 'fulfilled' ? projects.value.length : 0;
  const title =
    organization.status === 'fulfilled' ? organization.value.title : '';
  const numBookedForEvents =
    eventParticipationStats.status === 'fulfilled'
      ? eventParticipationStats.value[0].result
      : 0;

  return {
    id: orgId,
    stats: {
      numBookedByEventsByStartDate,
      numBookedForEvents,
      numCalls,
      numCallsByCallDate,
      numEventsWithBookedPeople,
      numLists,
      numPeople,
      numProjects,
      numSubmissions,
      numSubmissionsBySubmitDate,
    },
    title,
  };
}
