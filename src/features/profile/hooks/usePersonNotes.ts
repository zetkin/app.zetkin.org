import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { personNotesLoad, personNotesLoaded } from '../store';
import { ZetkinPersonNote } from '../types';

export default function usePersonNotes(orgId: number, personId: number) {
  const apiClient = useApiClient();
  const notes = useAppSelector(
    (state) => state.profiles.notesByPersonId[personId]
  );

  return useRemoteList(notes, {
    actionOnLoad: () => personNotesLoad(personId),
    actionOnSuccess: (data) => personNotesLoaded([personId, data]),
    loader: async () =>
      apiClient.get<ZetkinPersonNote[]>(
        `/api/orgs/${orgId}/people/${personId}/notes`
      ),
  });
}
