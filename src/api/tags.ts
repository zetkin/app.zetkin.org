/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createUseMutation,
  createUseMutationPatch,
  createUseQuery,
} from './utils/resourceHookFactories';

import { NewTagGroup } from 'components/organize/TagsManager/types';
import {
  ZetkinTag,
  ZetkinTagGroup,
  ZetkinTagPatchBody,
  ZetkinTagPostBody,
} from 'types/zetkin';

export const tagsResource = (orgId: string) => {
  const key = ['tags', orgId];
  const url = `/orgs/${orgId}/people/tags`;
  return {
    useCreate: createUseMutation<ZetkinTagPostBody, ZetkinTag>(key, url),
    useEdit: createUseMutationPatch<ZetkinTagPatchBody, ZetkinTag>({
      key,
      url,
    }),
    useQuery: createUseQuery<ZetkinTag[]>(key, url),
  };
};

export const tagGroupsResource = (orgId: string) => {
  const key = ['tagsGroups', orgId];
  const url = `/orgs/${orgId}/tag_groups`;

  return {
    useCreate: createUseMutation<NewTagGroup, ZetkinTagGroup>(key, url),
    useQuery: createUseQuery<ZetkinTagGroup[]>(key, url),
  };
};
