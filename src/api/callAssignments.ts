/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ZetkinCallAssignment } from 'types/zetkin';
import { createPrefetch, createUseQuery } from './utils/resourceHookFactories';

export const callAssignmentQuery = (orgId: string, callAssId: string) => {
  const key = ['callAssignment', callAssId];
  const url = `/orgs/${orgId}/call_assignments/${callAssId}`;

  return {
    prefetch: createPrefetch<ZetkinCallAssignment>(key, url),
    useQuery: createUseQuery<ZetkinCallAssignment>(key, url),
  };
};
