import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { subOrgsLoad, subOrgsLoaded } from '../store';
import flattenSubOrgs from '../utils/flattenSubOrgs';
import { ZetkinSubOrganization } from 'utils/types/zetkin';

export default function usePublicSubOrgs(orgId: number) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.subOrgsByOrgId[orgId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => subOrgsLoad(orgId),
    actionOnSuccess: (data) => {
      const subOrgs = flattenSubOrgs(data);
      return subOrgsLoaded([orgId, subOrgs]);
    },
    loader: () =>
      apiClient.get<ZetkinSubOrganization[]>(
        `/api/orgs/${orgId}/sub_organizations?recursive`
      ),
  });
}
