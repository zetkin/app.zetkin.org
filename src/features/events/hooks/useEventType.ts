import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinActivity } from 'utils/types/zetkin';
import { typeLoad, typeLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventType(
  orgId: number,
  typeId: number
): IFuture<ZetkinActivity> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const typeItem = useAppSelector((state) =>
    state.events.typeList.items.find((item) => item.id == typeId)
  );

  return loadItemIfNecessary(typeItem, dispatch, {
    actionOnLoad: () => typeLoad(typeId),
    actionOnSuccess: (data) => typeLoaded(data),
    loader: () =>
      apiClient.get<ZetkinActivity>(`/api/orgs/${orgId}/activities/${typeId}`),
  });
}
