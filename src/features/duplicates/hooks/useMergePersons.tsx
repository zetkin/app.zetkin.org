import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import { MergePostBody } from '../types';
import { personsMerged } from 'features/profile/store';

export default function useMergePersons(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (personIds: number[], overrides: Partial<ZetkinPerson>) => {
    await apiClient.post<ZetkinPerson, MergePostBody>(
      `/api/orgs/${orgId}/merges`,
      {
        objects: personIds,
        override: overrides,
        type: 'person',
      }
    );

    dispatch(personsMerged(personIds));
  };
}
