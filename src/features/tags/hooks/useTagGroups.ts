import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagGroupsLoad, tagGroupsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseTagGroupsReturn {
  tagGroupsFuture: IFuture<ZetkinTag[]>;
}
export default function useTagGroups(orgId: number): UseTagGroupsReturn {
  const tagGroupsList = useAppSelector((state) => state.tags.tagGroupList);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const tagGroupsFuture = loadListIfNecessary(tagGroupsList, dispatch, {
    actionOnLoad: () => tagGroupsLoad(),
    actionOnSuccess: (tags) => tagGroupsLoaded(tags),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
  });
  return { tagGroupsFuture };
}
