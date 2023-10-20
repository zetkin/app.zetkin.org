import {
  createUseMutation,
  createUseMutationPatch,
} from '../../../utils/api/resourceHookFactories';

import { NewTagGroup } from 'features/tags/components/TagManager/types';
import {
  ZetkinTag,
  ZetkinTagGroup,
  ZetkinTagPatchBody,
} from 'utils/types/zetkin';

export const tagsResource = (orgId: string) => {
  const key = ['tags', orgId];
  const url = `/orgs/${orgId}/people/tags`;
  return {
    useEdit: createUseMutationPatch<ZetkinTagPatchBody, ZetkinTag>({
      key,
      url,
    }),
  };
};

export const tagGroupsResource = (orgId: string) => {
  const key = ['tagsGroups', orgId];
  const url = `/orgs/${orgId}/tag_groups`;

  return {
    useCreate: createUseMutation<NewTagGroup, ZetkinTagGroup>(key, url),
  };
};
