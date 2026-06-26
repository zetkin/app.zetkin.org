import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { rootOrgLoad, rootOrgLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { getRootOrganizationDef } from '../rpc/getRootOrganization';

const useRootOrganization = (orgId: number): IFuture<ZetkinOrganization> => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  const rootOrgItem = useAppSelector(
    (state) => state.organizations.rootOrgByOrgId[orgId]
  );

  return loadItemIfNecessary(rootOrgItem, dispatch, {
    actionOnLoad: () => rootOrgLoad(orgId),
    actionOnSuccess: (data) => rootOrgLoaded([orgId, data]),
    loader: () => getRootOrganizationDef.handler({ orgId }, apiClient),
  });
};

export default useRootOrganization;
