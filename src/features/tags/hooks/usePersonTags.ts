import { useMemo } from 'react';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { personTagsLoad, personTagsLoaded } from 'features/tags/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { RemoteItem, RemoteList } from 'utils/storeUtils';

export default function usePersonTags(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const personTags = useAppSelector(
    (state) => state.tags.personTags[`${orgId}-${personId}`]
  );
  const tagsById = useAppSelector((state) => state.tags.tagsById);

  const appliedTagList = useMemo(() => {
    if (!personTags?.items) {
      return undefined;
    }

    const items = personTags.items
      .filter((item) => !item.deleted)
      .map((item) => {
        if (!item.data) {
          return <RemoteItem<ZetkinAppliedTag>>{
            ...item,
            data: null,
          };
        }

        const mapped = tagsById[item.data.id];
        if (!mapped || mapped.deleted) {
          return null;
        }

        return <RemoteItem<ZetkinAppliedTag>>{
          ...item,
          data: {
            ...mapped.data,
            value: item.data.value,
          },
        };
      })
      .filter((item) => !!item);

    return <RemoteList<ZetkinAppliedTag>>{
      ...personTags,
      items: items,
    };
  }, [personTags, tagsById]);

  return loadListIfNecessary(appliedTagList, dispatch, {
    actionOnLoad: () => personTagsLoad([orgId, personId]),
    actionOnSuccess: (tags) => personTagsLoaded([[orgId, personId], tags]),
    loader: () =>
      apiClient.get<ZetkinAppliedTag[]>(
        `/api/orgs/${orgId}/people/${personId}/tags`
      ),
  });
}
