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
    await apiClient.get<ZetkinOrganization[]>(`/api/orgs/`),
  ]);
  const isMemberRoot = (membership: ZetkinMembership): boolean => {
    // Only memberships we follow
    if (!membership.follow) {
      return false;
    }

    // Find the org of the followed membership
    const memberOrg = allOrganizations.find(
      (org) => org.id == membership.organization.id
    );
    if (!memberOrg) {
      return false;
    }

    // Found the root
    if (memberOrg.parent == null) {
      return true;
    }

    return (
      allMemberships.findIndex(
        (membership2) =>
          membership2.organization.id == memberOrg?.parent?.id &&
          isMemberRoot(membership2)
      ) == -1
    );
  };
  const filteredMemberships = allMemberships.filter((membership) => {
    // If there's a parent that we follow then ignore child as parent will give us its events
    return isMemberRoot(membership);
  });

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
