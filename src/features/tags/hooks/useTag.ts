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
  const tag = useAppSelector((state) => state.tags.tagsById[tagId]);

  const tagFuture = loadItemIfNecessary(tag, dispatch, {
    actionOnLoad: () => tagLoad([orgId, tagId]),
    actionOnSuccess: (tag) => tagLoaded([[orgId], tag]),
    loader: () =>
      apiClient.get<ZetkinTag>(`/api/orgs/${orgId}/people/tags/${tagId}`),
  });

  return {
    tagFuture,
  };
}
