import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagGroupsLoad, tagGroupsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTagGroups(orgId: number) {
  const tagGroupsList = useAppSelector((state) => state.tags.tagGroupList);
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  return loadListIfNecessary(tagGroupsList, dispatch, {
    actionOnLoad: () => tagGroupsLoad(),
    actionOnSuccess: (tagGroups) => tagGroupsLoaded(tagGroups),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
  });
}
