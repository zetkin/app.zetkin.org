import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagLoad, tagLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseTagReturn {
  tagFuture: IFuture<ZetkinTag>;
}
export default function useTag(orgId: number, tagId: number): UseTagReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.tags);

  const item = tags.tagList.items.find((item) => item.id == tagId);

  const tagFuture = loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => tagLoad(tagId),
    actionOnSuccess: (tag) => tagLoaded(tag),
    loader: () =>
      apiClient.get<ZetkinTag>(`/api/orgs/${orgId}/people/tags/${tagId}`),
  });

  return {
    tagFuture,
  };
}
