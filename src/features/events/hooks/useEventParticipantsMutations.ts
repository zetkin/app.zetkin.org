import useEventMutations from './useEventMutations';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import {
  participantAdded,
  participantDeleted,
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
  deleteParticipant: (participantId: number) => void;
  sendReminders: (eventId: number) => void;
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

  const deleteParticipant = async (participantId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/actions/${eventId}/participants/${participantId}`
    );
    dispatch(participantDeleted([eventId, participantId]));
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

  const sendReminders = async (eventId: number) => {
    dispatch(participantsRemind(eventId));
    await apiClient.post(`/api/orgs/${orgId}/actions/${eventId}/reminders`, {});
    dispatch(participantsReminded(eventId));
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
    deleteParticipant,
    sendReminders,
    setParticipantStatus,
    setReqParticipants,
    updateParticipant,
  };
}
