import { invalidateTimeline } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinNote, ZetkinNoteBody } from 'utils/types/zetkin';

type ZetkinNotePatchBody = Pick<ZetkinNote, 'id' | 'text'>;

interface UseTimeLineNoteReturn {
  addNote: (noteBody: ZetkinNoteBody) => Promise<void>;
  editNote: (noteBody: ZetkinNotePatchBody) => Promise<void>;
}

export default function useTimelineNote(
  orgId: number,
  instanceId: number
): UseTimeLineNoteReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function addNote(note: ZetkinNoteBody): Promise<void> {
    await apiClient.post<ZetkinNote>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/notes`,
      note
    );
    dispatch(invalidateTimeline(instanceId));
  }

  async function editNote(note: ZetkinNotePatchBody): Promise<void> {
    await apiClient.patch<ZetkinNote>(
      `/api/orgs/${orgId}/journey_instances/${instanceId}/notes/${note.id}`,
      { text: note.text }
    );
    dispatch(invalidateTimeline(instanceId));
  }

  return { addNote, editNote };
}
