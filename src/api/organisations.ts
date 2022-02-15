/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createUseQuery } from './utils/resourceHookFactories';

import { ZetkinOrganization } from '../types/zetkin';

export const organisationSubOrgsResource = (orgId: string) => {
  const key = ['organisationsSubOrgs', orgId];
  const url = `/orgs/${orgId}/sub_organizations`;

  return {
    useQuery: createUseQuery<ZetkinOrganization>(key, url),
  };
};
