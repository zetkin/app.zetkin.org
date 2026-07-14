import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagsLoad, tagsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useRemoteListMapping from 'utils/hooks/useRemoteListMapping';

export default function useTags(orgId: number): IFuture<ZetkinTag[]> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const tagIndex = useAppSelector((state) => state.tags.orgTags[orgId]);
  const tagsById = useAppSelector((state) => state.tags.tagsById);
  const tagListState = useRemoteListMapping(tagIndex, tagsById);

  return loadListIfNecessary(tagListState, dispatch, {
    actionOnLoad: () => tagsLoad([orgId]),
    actionOnSuccess: (tags) => tagsLoaded([[orgId], tags]),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  });
}
