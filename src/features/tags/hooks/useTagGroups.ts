import { useCallback } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagGroupsLoad, tagGroupsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useRemoteListMapping from 'utils/hooks/useRemoteListMapping';

export default function useTagGroups(orgId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const tagGroupIndex = useAppSelector((state) => state.tags.tagGroups[orgId]);
  const groupsById = useAppSelector((state) => state.tags.groupsById);
  const tagGroupMapper = useCallback(
    (groups: number[]) =>
      groups
        .map((groupId) => groupsById[groupId])
        .filter((group) => !!group)
        .filter((group) => !group.deleted)
        .map((group) => group.data)
        .filter((group) => !!group),
    [groupsById]
  );
  const tagGroupsList = useRemoteListMapping(tagGroupIndex, tagGroupMapper);

  return loadListIfNecessary(tagGroupsList, dispatch, {
    actionOnLoad: () => tagGroupsLoad([orgId]),
    actionOnSuccess: (tagGroups) => tagGroupsLoaded([[orgId], tagGroups]),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/tag_groups`),
  });
}
