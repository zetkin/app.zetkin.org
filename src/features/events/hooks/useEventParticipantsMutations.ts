import useEventMutations from './useEventMutations';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import {
  participantAdded,
  participantsRemind,
  participantsReminded,
  participantUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export enum participantStatus {
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
  NOSHOW = 'noshow',
}

type useEventParticipantsMutationsMutationsReturn = {
  addParticipant: (personId: number) => void;
  sendReminders: (eventId: number, participantIds: number[]) => void;
  setParticipantStatus: (
    personId: number,
    status: participantStatus | null
  ) => void;
  setReqParticipants: (reqParticipants: number) => void;
  updateParticipant: (
    personId: number,
    data: Partial<ZetkinEventParticipant>
  ) => void;
};

export default function useEventParticipantsMutations(
  orgId: number,
  eventId: number
): useEventParticipantsMutationsMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { updateEvent } = useEventMutations(orgId, eventId);

  const addParticipant = async (personId: number) => {
    const participant = await apiClient.put<ZetkinEventParticipant>(
      `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`,
      {}
    );
    dispatch(participantAdded([eventId, participant]));
  };

  const updateParticipant = (
    personId: number,
    data: Partial<ZetkinEventParticipant>
  ) => {
    return apiClient
      .put<ZetkinEventParticipant>(
        `/api/orgs/${orgId}/actions/${eventId}/participants/${personId}`,
        data
      )
      .then((participant) => {
        dispatch(participantUpdated([eventId, participant]));

        return participant;
      });
  };

  const sendReminders = async (eventId: number, participantIds: number[]) => {
    dispatch(participantsRemind(participantIds));
    await apiClient.post(`/api/orgs/${orgId}/actions/${eventId}/reminders`, {});
    dispatch(participantsReminded([eventId, participantIds]));
  };

  const setReqParticipants = (reqParticipants: number) => {
    updateEvent({
      num_participants_required: reqParticipants,
    });
  };

  const setParticipantStatus = (
    personId: number,
    status: participantStatus | null
  ) => {
    updateParticipant(personId, {
      status: status,
    });
  };

  return {
    addParticipant,
    sendReminders,
    setParticipantStatus,
    setReqParticipants,
    updateParticipant,
  };
}
