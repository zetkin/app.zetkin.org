/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createPrefetch,
  createUseMutation,
  createUseQuery,
} from './utils/resourceHookFactories';

import { OrganisationTree } from 'components/organize/people/PersonOrganisationsCard/OrganisationsTree';
import { ZetkinPerson } from 'types/zetkin';

export const personResource = (orgId: string, personId: string) => {
  const key = ['person', personId];
  const url = `/orgs/${orgId}/people/${personId}`;

  return {
    prefetch: createPrefetch<ZetkinPerson>(key, url),
    useQuery: createUseQuery<ZetkinPerson>(key, url),
    useUpdate: createUseMutation<Partial<ZetkinPerson>, ZetkinPerson>(
      key,
      url,
      {
        method: 'PATCH',
      }
    ),
  };
};

export const personOrganisationsResource = (
  orgId: string,
  personId: string
) => {
  const key = ['personOrganisations', personId];
  const url = `/organize/${orgId}/people/${personId}/organizations`;

  return {
    useQuery: createUseQuery<{
      organisationTree: OrganisationTree;
      personOrganisationTree: OrganisationTree;
    }>(key, url),
  };
};
