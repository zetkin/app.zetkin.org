import { QueryState } from 'react-query/types/core/query';
import { UseQueryResult } from 'react-query';

import { ScaffoldedContext } from 'utils/next';
import { ZetkinOrganization } from 'utils/types/zetkin';
import {
  createPrefetch,
  createUseQuery,
} from '../../../utils/api/resourceHookFactories';

interface OrganizationResources {
  useQuery: () => UseQueryResult<ZetkinOrganization, unknown>;
  prefetch: (scaffoldContext: ScaffoldedContext) => Promise<{
    data?: ZetkinOrganization | undefined;
    state?: QueryState<ZetkinOrganization, unknown> | undefined;
  }>;
}

export const organizationResource = (orgId: string): OrganizationResources => {
  const key = ['org', orgId];
  const url = `/orgs/${orgId}`;

  return {
    prefetch: createPrefetch<ZetkinOrganization>(key, url),
    useQuery: createUseQuery<ZetkinOrganization>(key, url),
  };
};
