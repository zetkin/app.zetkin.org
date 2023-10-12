import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinActivity } from 'utils/types/zetkin';
import { typeAdd, typeAdded, typesLoad, typesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type useEventTypesReturn = {
  addType: (title: string) => void;
  eventTypes: IFuture<ZetkinActivity[]>;
};

export default function useEventTypes(orgId: number): useEventTypesReturn {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const typeList = useAppSelector((state) => state.events.typeList);

  const addType = (title: string) => {
    dispatch(typeAdd([orgId, { title }]));
    apiClient
      .post<ZetkinActivity>(`/api/orgs/${orgId}/activities`, { title })
      .then((event) => {
        dispatch(typeAdded(event));
      });
  };

  const eventTypes = loadListIfNecessary(typeList, dispatch, {
    actionOnLoad: () => typesLoad(orgId),
    actionOnSuccess: (data) => typesLoaded([orgId, data]),
    loader: () =>
      apiClient.get<ZetkinActivity[]>(`/api/orgs/${orgId}/activities`),
  });

  return { addType, eventTypes };
}
