import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { tagsLoad, tagsLoaded } from '../store';

export default function useAreaTags(
  orgId: number,
  areaId: string
): IFuture<ZetkinAppliedTag[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.areas.tagsByAreaId[areaId]);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => tagsLoad(areaId),
    actionOnSuccess: (data) => tagsLoaded([areaId, data]),
    loader: () =>
      apiClient.get<ZetkinAppliedTag[]>(
        `/beta/orgs/${orgId}/areas/${areaId}/tags`
      ),
  });
}
