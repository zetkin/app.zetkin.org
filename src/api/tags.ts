/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createUseMutation,
  createUseQuery,
} from './utils/resourceHookFactories';

import { NewTagGroup } from 'components/organize/TagsManager/types';
import { ZetkinTagGroup } from 'types/zetkin';

export const tagGroupsResource = (orgId: string) => {
  const key = ['tagsGroups', orgId];
  const url = `/orgs/${orgId}/tag_groups`;

  return {
    useAdd: createUseMutation<NewTagGroup, ZetkinTagGroup>(key, url),
    useQuery: createUseQuery<ZetkinTagGroup[]>(key, url),
  };
};
