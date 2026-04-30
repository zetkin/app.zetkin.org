import { useCallback } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { personTagsLoad, personTagsLoaded } from 'features/tags/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useRemoteListMapping from 'utils/hooks/useRemoteListMapping';

export default function usePersonTags(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tagIndex = useAppSelector(
    (state) => state.tags.personTags[`${orgId}-${personId}`]
  );
  const tags = useAppSelector((state) => state.tags.tagsById);
  const groups = useAppSelector((state) => state.tags.groupsById);

  const tagMapper = useCallback(
    (personTags: { id: number; value: number | string | null }[]) =>
      personTags
        .map(
          ({ id, value }) =>
            tags[id]?.data &&
            !tags[id]?.deleted &&
            <ZetkinAppliedTag>{
              ...tags[id].data,
              group: tags[id].data.group && groups[tags[id].data.group.id],
              value,
            }
        )
        .filter((tag) => !!tag),
    [tags, groups]
  );
  const tagList = useRemoteListMapping(tagIndex, tagMapper);

  return loadListIfNecessary(tagList, dispatch, {
    actionOnLoad: () => personTagsLoad([orgId, personId]),
    actionOnSuccess: (tags) => personTagsLoaded([[orgId, personId], tags]),
    loader: () =>
      apiClient.get<ZetkinAppliedTag[]>(
        `/api/orgs/${orgId}/people/${personId}/tags`
      ),
  });
}
