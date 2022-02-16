/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createPrefetch,
  createUseMutation,
  createUseQuery,
} from './utils/resourceHookFactories';

import { OrganisationTree } from 'components/organize/people/PersonOrganisationsCard/OrganisationsTree';
import { PersonOrganisation } from 'utils/organize/people';
import { ZetkinOrganization, ZetkinPerson } from 'types/zetkin';

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
      memberships: PersonOrganisation[];
      organisationTree: OrganisationTree;
      personOrganisationTree: OrganisationTree;
      subOrganisations: ZetkinOrganization[];
    }>(key, url),
  };
};
