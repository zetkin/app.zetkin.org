import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { tagGroupsLoad, tagGroupsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';

interface UseTagGroupsReturn {
  tagGroupsFuture: IFuture<ZetkinTagGroup[]>;
}
export default function useTagGroups(orgId: number): UseTagGroupsReturn {
  const tagGroupsList = useAppSelector((state) => state.tags.tagGroupList);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const tagGroupsFuture = loadListIfNecessary(tagGroupsList, dispatch, {
    actionOnLoad: () => tagGroupsLoad(),
    actionOnSuccess: (tagGroups) => tagGroupsLoaded(tagGroups),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
  });
  return { tagGroupsFuture };
}
