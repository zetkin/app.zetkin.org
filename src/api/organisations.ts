/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createUseQuery } from './utils/resourceHookFactories';

import { ZetkinOrganization } from '../types/zetkin';

export const organizationResource = (orgId: string) => {
  const key = ['organization', orgId];
  const url = `/orgs/${orgId}`;

  return {
    useQuery: createUseQuery<ZetkinOrganization>(key, url),
  };
};

export const organizationSubOrgsResource = (orgId: string) => {
  const key = ['organizationsSubOrgs', orgId];
  const url = `/orgs/${orgId}/sub_organizations`;

  return {
    useQuery: createUseQuery<ZetkinOrganization[]>(key, url),
  };
};
