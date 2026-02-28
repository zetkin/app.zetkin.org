import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinView } from 'features/views/components/types';
import { viewsByOrgIdLoad, viewsByOrgIdLoaded } from '../store';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSubOrgViews(
  orgIds: number[]
): IFuture<ZetkinView[]> {
  const apiClient = useApiClient();
  const views = useAppSelector((state) => state.views);
  const dispatch = useAppDispatch();

  const missingOrgIds = orgIds.filter((orgId) =>
    shouldLoad(views.viewsByOrgId[orgId])
  );
  const loadingOrgIds = orgIds.filter(
    (orgId) => views.viewsByOrgId[orgId]?.isLoading
  );

  if (missingOrgIds.length > 0) {
    missingOrgIds.forEach((orgId) => {
      dispatch(viewsByOrgIdLoad(orgId));
      apiClient
        .get<ZetkinView>(`api/orgs/${orgId}/people/views`)
        .then((items) => {
          dispatch(viewsByOrgIdLoaded([orgId, items]));
        });
    });
  }

  if (loadingOrgIds.length > 0 || missingOrgIds.length > 0) {
    return new LoadingFuture();
  } else {
    return new ResolvedFuture(
      orgIds
        .map((orgId) => views.viewsByOrgId[orgId]?.data)
        .filter((view) => view != null)
    );
  }
}
