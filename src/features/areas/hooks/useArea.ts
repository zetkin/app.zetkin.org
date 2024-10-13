import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areaLoad, areaLoaded } from '../store';
import { ZetkinArea } from '../types';

export default function useArea(orgId: number, areaId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const areaItems = useAppSelector((state) => state.areas.areaList.items);
  const areaItem = areaItems.find((item) => item.id === areaId);

  return loadItemIfNecessary(areaItem, dispatch, {
    actionOnLoad: () => areaLoad(areaId),
    actionOnSuccess: (data) => areaLoaded(data),
    loader: () =>
      apiClient.get<ZetkinArea>(`/beta/orgs/${orgId}/areas/${areaId}`),
  });
}
