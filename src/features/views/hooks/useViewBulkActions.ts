import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPersonImportPostBody } from 'features/import/types';
import { personsDeleted } from 'features/profile/store';

export default function useViewBulkActions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async bulkDeletePersons(personIds: number[]) {
      await apiClient.post<ZetkinPersonImportPostBody>(
        `/api/orgs/${orgId}/bulk/execute`,
        {
          ops: personIds.map((id) => ({
            key: {
              id: id,
            },
            op: 'person.get',
            ops: [
              {
                op: 'person.delete',
              },
            ],
          })),
        }
      );

      dispatch(personsDeleted(personIds));
    },
  };
}
