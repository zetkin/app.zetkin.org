import { loadListIfNecessary } from 'core/caching/cacheUtils';
import useOrganization from './useOrganization';
import { ZetkinSubOrganization } from 'utils/types/zetkin';
import { subOrgsLoad, subOrgsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

const flattenSubOrgs = (orgs: ZetkinSubOrganization[]) => {
  let subOrgs: ZetkinSubOrganization[] = [];
  orgs.forEach((org) => {
    if (org.sub_orgs.length > 0) {
      const children = flattenSubOrgs(org.sub_orgs);
      if (children.length > 0) {
        subOrgs = [...children, ...subOrgs];
      }
    }
    subOrgs.unshift(org);
  });
  return subOrgs;
};

export default function useSubOrganizations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const subOrgs = useAppSelector(
    (state) => state.organizations.subOrgsByOrgId[orgId]
  );
  const currentOrg = useOrganization(orgId).data;

  return loadListIfNecessary(subOrgs, dispatch, {
    actionOnLoad: () => subOrgsLoad(orgId),
    actionOnSuccess: (data) => {
      const subOrgs = flattenSubOrgs(data);
      if (currentOrg) {
        subOrgs.unshift({ ...currentOrg, sub_orgs: [] });
      }
      return subOrgsLoaded([orgId, subOrgs]);
    },
    loader: () =>
      apiClient.get<ZetkinSubOrganization[]>(
        `/api/orgs/${orgId}/sub_organizations?recursive`
      ),
  });
}
