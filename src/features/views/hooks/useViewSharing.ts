import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinObjectAccess } from 'core/api/types';
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
  accessListFuture: IFuture<ZetkinObjectAccess[]>;
  grantAccess: (personId: number, level: ZetkinObjectAccess['level']) => void;
  officialsFuture: IFuture<ZetkinOfficial[]>;
  revokeAccess: (personId: number) => void;
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
      apiClient.get<ZetkinObjectAccess[]>(
        `/api/orgs/${orgId}/people/views/${viewId}/access`
      ),
  });

  const officialsFuture = loadListIfNecessary(views.officialList, dispatch, {
    actionOnLoad: () => officialsLoad(),
    actionOnSuccess: (data) => officialsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinOfficial[]>(`/api/orgs/${orgId}/officials`),
  });

  const grantAccess = (
    personId: number,
    level: ZetkinObjectAccess['level']
  ) => {
    apiClient
      .put<ZetkinObjectAccess>(
        `/api/orgs/${orgId}/people/views/${viewId}/access/${personId}`,
        {
          level,
        }
      )
      .then((accessObj) => {
        dispatch(accessAdded([viewId, accessObj]));
      });
  };

  const revokeAccess = (personId: number) => {
    apiClient
      .delete(`/api/orgs/${orgId}/people/views/${viewId}/access/${personId}`)
      .then(() => {
        dispatch(accessRevoked([viewId, personId]));
      });
  };

  return { accessListFuture, grantAccess, officialsFuture, revokeAccess };
}
