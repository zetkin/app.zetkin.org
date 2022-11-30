import { CreateNewViewReqBody } from 'pages/api/views/createNew';
import { ZetkinView } from 'features/views/components/types';
import {
  createPrefetch,
  createUseMutation,
  createUseMutationDelete,
  createUseQuery,
} from '../../../utils/api/resourceHookFactories';

export const viewsResource = (orgId: string) => {
  const key = ['views', orgId];
  const url = `/orgs/${orgId}/people/views`;

  return {
    prefetch: createPrefetch<ZetkinView[]>(key, url),
    useCreate: createUseMutation<CreateNewViewReqBody, ZetkinView>(
      key,
      `/views/createNew?orgId=${orgId}`
    ),
    useDelete: createUseMutationDelete({ key, url }),
    useQuery: createUseQuery<ZetkinView[]>(key, url),
  };
};
