import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagsLoad, tagsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseTagsReturn {
  tagsFuture: IFuture<ZetkinTag[]>;
}
export default function useTags(orgId: number): UseTagsReturn {
  const tagList = useAppSelector((state) => state.tags.tagList);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const tagsFuture = loadListIfNecessary(tagList, dispatch, {
    actionOnLoad: () => tagsLoad(),
    actionOnSuccess: (tags) => tagsLoaded(tags),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  });
  return { tagsFuture };
}
