import useEventMutations from './useEventMutations';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  participantAdded,
  participantsReminded,
  participantUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useEventParticipantsMutationsMutationsReturn = {
  addParticipant: (personId: number) => void;
  attendedParticipant: (personId: number) => void;
  cancelParticipant: (personId: number) => void;
  noShowParticipant: (personId: number) => void;
  reBookParticipant: (personId: number) => void;
  sendReminders: (eventId: number) => void;
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

  const attendedParticipant = (personId: number) => {
    updateParticipant(personId, {
      status: 'attended',
    });
  };

  const cancelParticipant = (
    personId: number
  ): IFuture<ZetkinEventParticipant> => {
    const promise = updateParticipant(personId, {
      status: 'cancelled',
    });
    return new PromiseFuture(promise);
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

  const noShowParticipant = (personId: number) => {
    updateParticipant(personId, {
      status: 'noshow',
    });
  };

  const reBookParticipant = (personId: number) => {
    updateParticipant(personId, {
      status: null,
    });
  };

  const sendReminders = async (eventId: number) => {
    await apiClient.post(`/api/orgs/${orgId}/actions/${eventId}/reminders`, {});
    dispatch(participantsReminded(eventId));
  };

  const setReqParticipants = (reqParticipants: number) => {
    updateEvent({
      num_participants_required: reqParticipants,
    });
  };
  return {
    addParticipant,
    attendedParticipant,
    cancelParticipant,
    noShowParticipant,
    reBookParticipant,
    sendReminders,
    setReqParticipants,
    updateParticipant,
  };
}
