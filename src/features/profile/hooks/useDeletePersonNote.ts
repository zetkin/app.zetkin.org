import { useApiClient, useAppDispatch } from 'core/hooks';
import { personNoteDelete, personNoteDeleted } from '../store';

export default function useDeletePersonNote(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (noteId: number) => {
    dispatch(personNoteDelete([personId, noteId]));
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/notes/${noteId}`
    );
    dispatch(personNoteDeleted([personId, noteId]));
  };
}
