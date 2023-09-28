import { useSelector } from 'react-redux';

import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagLoad, tagLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTagReturn {
  tagFuture: IFuture<ZetkinTag>;
}
export default function useTag(orgId: number, tagId: number): UseTagReturn {
  const apiClient = useApiClient();
  const tags = useSelector((state: RootState) => state.tags);
  const env = useEnv();

  const item = tags.tagList.items.find((item) => item.id == tagId);

  const tagFuture = loadItemIfNecessary(item, env.store, {
    actionOnLoad: () => tagLoad(tagId),
    actionOnSuccess: (tag) => tagLoaded(tag),
    loader: () =>
      apiClient.get<ZetkinTag>(`/api/orgs/${orgId}/people/tags/${tagId}`),
  });

  return {
    tagFuture,
  };
}
