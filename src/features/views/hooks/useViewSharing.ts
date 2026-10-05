import { ListAccessLevel, Zetkin2ListAccess } from '../types';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOfficial } from 'utils/types/zetkin';
import {
  accessAdded,
  accessLoad,
  accessLoaded,
  accessRevoked,
  officialsLoad,
  officialsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseViewSharingReturn {
  accessListFuture: IFuture<Zetkin2ListAccess[]>;
  grantAccess: (userId: number, level: ListAccessLevel) => void;
  officialsFuture: IFuture<ZetkinOfficial[]>;
  revokeAccess: (userId: number) => void;
}
export default function useViewSharing(
  orgId: number,
  viewId: number
): UseViewSharingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);
  const cachedAccessList = views.accessByViewId[viewId];

  const accessListFuture = loadListIfNecessary(cachedAccessList, dispatch, {
    actionOnLoad: () => accessLoad(viewId),
    actionOnSuccess: (data) => accessLoaded([viewId, data]),
    loader: () =>
      apiClient.get<Zetkin2ListAccess[]>(
        `/api2/orgs/${orgId}/lists/${viewId}/access`
      ),
  });

  const officialsFuture = loadListIfNecessary(views.officialList, dispatch, {
    actionOnLoad: () => officialsLoad(),
    actionOnSuccess: (data) => officialsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinOfficial[]>(`/api/orgs/${orgId}/officials`),
  });

  const grantAccess = (userId: number, level: ListAccessLevel) => {
    apiClient
      .put<Zetkin2ListAccess>(
        `/api2/orgs/${orgId}/lists/${viewId}/access/${userId}`,
        {
          level,
        }
      )
      .then((accessObj) => {
        dispatch(accessAdded([viewId, accessObj]));
      });
  };

  const revokeAccess = (userId: number) => {
    apiClient
      .delete(`/api2/orgs/${orgId}/lists/${viewId}/access/${userId}`)
      .then(() => {
        dispatch(accessRevoked([viewId, userId]));
      });
  };

  return { accessListFuture, grantAccess, officialsFuture, revokeAccess };
}
