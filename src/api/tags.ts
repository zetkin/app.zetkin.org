/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createUseMutationPut,
  createUseQuery,
} from './utils/resourceHookFactories';

import { ZetkinTagGroup } from 'types/zetkin';

export const tagGroupsResource = (orgId: string) => {
  const key = ['tagsGroups', orgId];
  const url = `/orgs/${orgId}/tag_groups`;

  return {
    useAdd: createUseMutationPut({ key, url }),
    useQuery: createUseQuery<ZetkinTagGroup[]>(key, url),
  };
};
