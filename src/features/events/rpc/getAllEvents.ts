import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinEvent,
  ZetkinMembership,
  ZetkinOrganization,
} from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';
import getEventState from '../utils/getEventState';
import { EventState } from '../hooks/useEventState';

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

  const eventsByOrg = await Promise.all(
    filteredMemberships.map(
      async (membership) =>
        await apiClient.get<ZetkinEvent[]>(
          `/api/orgs/${membership.organization.id}/actions?filter=start_time%3E=${now}&recursive`
        )
    )
  );
  const events = eventsByOrg.flat();

  return events.filter((event) => {
    const state = getEventState(event);
    return state == EventState.OPEN || state == EventState.SCHEDULED;
  });
}
