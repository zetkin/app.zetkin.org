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

  const tagMapper = useCallback(
    ({ id, value }: { id: number; value: number | string | null }) => {
      const tag = tags[id];

      if (!tag || !tag.data || tag.deleted) {
        return null;
      }

      return <ZetkinAppliedTag>{
        ...tag.data,
        value,
      };
    },
    [tags]
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
