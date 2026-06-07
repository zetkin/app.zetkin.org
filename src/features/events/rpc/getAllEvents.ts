import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinEvent,
  ZetkinCampaign,
  ZetkinMembership,
  ZetkinOrganization,
} from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';
import getEventState from '../utils/getEventState';
import { EventState } from '../hooks/useEventState';
import { mapWithConcurrency, withRetry } from 'utils/asyncUtils';

const MAX_CONCURRENT_FETCHES = 5;

const paramsSchema = z.object({});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEvent[];

export const getAllEventsDef = {
  handler: handle,
  name: 'getAllEvents',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getAllEventsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const [allMemberships, allOrganizations] = await Promise.all([
    apiClient.get<ZetkinMembership[]>('/api/users/me/memberships'),
    apiClient.get<ZetkinOrganization[]>(`/api/orgs/`),
  ]);
  const getRootOrgWeAreMemberOf = (
    org: ZetkinOrganization,
    currentBest: ZetkinOrganization
  ): ZetkinOrganization => {
    let newBest = currentBest;

    // Find the org of the followed membership
    const weFollowThisOrg = allMemberships.some(
      (membership) => membership.organization.id == org.id && membership.follow
    );

    if (weFollowThisOrg) {
      newBest = org;
    }

    // Found the root
    if (org.parent == null) {
      return newBest;
    }

    const parent = allOrganizations.find((o) => o.id == org.parent?.id);
    if (!parent) {
      return newBest;
    }

    return getRootOrgWeAreMemberOf(parent, newBest);
  };
  const { filteredMemberships } = allMemberships.reduce<{
    filteredMemberships: ZetkinMembership[];
    orgs: number[];
  }>(
    (acc, membership) => {
      if (!membership.follow) {
        return acc;
      }
      const memberOrg = allOrganizations.find(
        (org) => org.id == membership.organization.id
      );
      if (!memberOrg) {
        return acc;
      }

      const rootOrg = getRootOrgWeAreMemberOf(memberOrg, memberOrg);

      if (!acc.orgs.includes(rootOrg.id)) {
        acc.orgs.push(rootOrg.id);
        acc.filteredMemberships.push(membership);
      }

      return acc;
    },
    { filteredMemberships: [], orgs: [] }
  );

  const now = new Date().toISOString();

  const eventsByOrg = await mapWithConcurrency(
    filteredMemberships,
    MAX_CONCURRENT_FETCHES,
    (membership) =>
      withRetry(() =>
        apiClient.get<ZetkinEvent[]>(
          `/api/orgs/${membership.organization.id}/actions?filter=start_time%3E=${now}&recursive`
        )
      )
  );
  const events = eventsByOrg.flat();

  const isPublishedByDate = (event: ZetkinEvent) =>
    !!event.published && new Date(event.published) < new Date();

  const campaignsToFetch = new Map<
    string,
    { campaignId: number; orgId: number }
  >();
  events.forEach((event) => {
    if (event.campaign && isPublishedByDate(event)) {
      const key = `${event.organization.id}-${event.campaign.id}`;
      campaignsToFetch.set(key, {
        campaignId: event.campaign.id,
        orgId: event.organization.id,
      });
    }
  });

  const campaignEntries = Array.from(campaignsToFetch.entries());
  const fetchedCampaigns = await mapWithConcurrency(
    campaignEntries,
    MAX_CONCURRENT_FETCHES,
    ([, { orgId, campaignId }]) =>
      withRetry(() =>
        apiClient.get<ZetkinCampaign>(
          `/api/orgs/${orgId}/campaigns/${campaignId}`
        )
      ).catch(() => null)
  );
  const campaignsByKey = new Map<string, ZetkinCampaign | null>(
    campaignEntries.map(([key], index) => [key, fetchedCampaigns[index]])
  );

  return events.filter((event) => {
    let isPublished = isPublishedByDate(event);

    if (event.campaign && isPublished) {
      const campaign =
        campaignsByKey.get(`${event.organization.id}-${event.campaign.id}`) ??
        null;
      isPublished =
        !!campaign &&
        !campaign.archived &&
        campaign.published &&
        campaign.visibility == 'open';
    }

    const state = getEventState(event);
    return (
      (state == EventState.OPEN || state == EventState.SCHEDULED) && isPublished
    );
  });
}
