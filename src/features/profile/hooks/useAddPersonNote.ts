import { useApiClient, useAppDispatch } from 'core/hooks';
import { personNoteAdded } from '../store';
import { ZetkinPersonNote } from '../types';

export default function useAddPersonNote(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (note: string) => {
    const addedNote = await apiClient.post<
      ZetkinPersonNote,
      Pick<ZetkinPersonNote, 'text'>
    >(`/api/orgs/${orgId}/people/${personId}/notes`, { text: note });

    dispatch(personNoteAdded([addedNote, personId]));
  };
}
