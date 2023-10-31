import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTag } from 'utils/types/zetkin';
import { personTagsLoad, personTagsLoaded } from 'features/tags/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePersonTags(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tagList = useAppSelector(
    (state) => state.tags.tagsByPersonId[personId]
  );

  return loadListIfNecessary(tagList, dispatch, {
    actionOnLoad: () => personTagsLoad(personId),
    actionOnSuccess: (tags) => personTagsLoaded([personId, tags]),
    loader: () =>
      apiClient.get<ZetkinTag[]>(`/api/orgs/${orgId}/people/${personId}/tags`),
  });
}
