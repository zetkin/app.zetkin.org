import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPersonImportPostBody } from 'features/import/types';
import { personsDeleted } from 'features/profile/store';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { rowsTagged } from '../store';

export default function useViewBulkActions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async bulkDeletePeople(personIds: number[]) {
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
    async bulkTagPeople(personIds: number[], tags: ZetkinAppliedTag[]) {
      await apiClient.post<ZetkinPersonImportPostBody>(
        `/api/orgs/${orgId}/bulk/execute`,
        {
          ops: personIds.map((id) => ({
            key: {
              id,
            },
            op: 'person.get',
            ops: tags.map((tag) => ({
              op: 'person.tag',
              tag_id: tag.id,
              value: tag.value ?? undefined,
            })),
          })),
        }
      );
      dispatch(rowsTagged([personIds, tags]));
    },
  };
}
