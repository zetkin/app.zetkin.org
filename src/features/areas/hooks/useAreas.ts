import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areasLoad, areasLoaded } from '../store';
import { Zetkin2Area } from '../types';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useAreas(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.areas.areaList);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => areasLoad(),
    actionOnSuccess: (data) => areasLoaded(data),
    loader: async () =>
      fetchAllPaginated<Zetkin2Area>((page) =>
        apiClient.get(`/api2/orgs/${orgId}/areas?size=100&page=${page}`)
      ),
  });
}
