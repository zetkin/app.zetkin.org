import { useMemo } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { personTagsLoad, personTagsLoaded } from 'features/tags/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useRemoteListMapping from 'utils/hooks/useRemoteListMapping';
import { remoteList } from 'utils/storeUtils';
import { SafeRecord } from 'utils/types';

export default function usePersonTags(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tagValueIndex = useAppSelector(
    (state) => state.tags.personTags[`${orgId}-${personId}`]
  );
  const tagsById = useAppSelector((state) => state.tags.tagsById);

  const tagIndex = useMemo(
    () =>
      remoteList<number>(
        tagValueIndex?.items
          .map((item) => item.data?.id)
          .filter((value) => typeof value === 'number')
      ),
    [tagValueIndex]
  );
  const tagList = useRemoteListMapping(tagIndex, tagsById);
  const appliedTagList = useMemo(() => {
    const valuesById = tagValueIndex
      ? tagValueIndex.items.reduce(
          (prev, cur) => {
            if (!cur.data) {
              return prev;
            }
            prev[cur.data.id] = cur.data.value;
            return prev;
          },
          {} as SafeRecord<number, string | number | null>
        )
      : {};

    return remoteList<ZetkinAppliedTag>(
      tagList?.items.map(
        (tag) =>
          <ZetkinAppliedTag>{
            ...tag.data,
            value: (tag.data && valuesById[tag.data.id]) || null,
          }
      )
    );
  }, [tagList?.items, tagValueIndex]);

  return loadListIfNecessary(appliedTagList, dispatch, {
    actionOnLoad: () => personTagsLoad([orgId, personId]),
    actionOnSuccess: (tags) => personTagsLoaded([[orgId, personId], tags]),
    loader: () =>
      apiClient.get<ZetkinAppliedTag[]>(
        `/api/orgs/${orgId}/people/${personId}/tags`
      ),
  });
}
