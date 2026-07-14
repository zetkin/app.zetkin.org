import { useMemo } from 'react';

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
  const groupsById = useAppSelector((state) => state.tags.groupsById);
  const tagListState = useRemoteListMapping(tagIndex, tagsById);
  const tagsWithGroups = useMemo(
    () =>
      tagListState && {
        ...tagListState,
        items: tagListState.items.map((tagItem) => ({
          ...tagItem,
          data: tagItem.data
            ? {
                ...tagItem.data,
                group: tagItem.data.group
                  ? (groupsById[tagItem.data.group.id]?.data ?? null)
                  : null,
              }
            : null,
        })),
      },
    [groupsById, tagListState]
  );

  return loadListIfNecessary(tagsWithGroups, dispatch, {
    actionOnLoad: () => tagsLoad([orgId]),
    actionOnSuccess: (tags) => tagsLoaded([[orgId], tags]),
    loader: () => apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/tags`),
  });
}
