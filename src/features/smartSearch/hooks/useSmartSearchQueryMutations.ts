import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinQueryPatchBody } from '../types/api';
import { ZetkinQuery } from '../components/types';
import { queryUpdated } from '../store';

export default function useSmartSearchQueryMutations(
  orgId: number,
  queryId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async updateQuery(data: ZetkinQueryPatchBody) {
      const updatedQuery = await apiClient.patch<
        ZetkinQuery,
        ZetkinQueryPatchBody
      >(`/api/orgs/${orgId}/people/queries/${queryId}`, data);
      dispatch(queryUpdated(updatedQuery));
    },
  };
}
