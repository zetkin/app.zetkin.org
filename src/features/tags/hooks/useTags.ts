import { IFuture } from 'core/caching/futures';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagLoad, tagLoaded, tagsLoad, tagsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTags(
  orgId: number,
  tagId: number
): IFuture<ZetkinTag[]> {
  const tagList = useAppSelector((state) => state.tags.tagList);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  return loadListIfNecessary(tagList, dispatch, {
    actionOnLoad: () => tagsLoad(),
    actionOnSuccess: (tags) => tagsLoaded(tags),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  });
}
