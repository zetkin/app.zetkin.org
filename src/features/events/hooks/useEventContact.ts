import useEventMutations from '../hooks/useEventMutations';
import useEventParticipants from './useEventParticipants';
import useEventParticipantsMutations from './useEventParticipantsMutations';

type useEventContacReturn = {
  removeContact: () => void;
  setContact: (contactId: number) => void;
};

export default function useEventContact(
  orgId: number,
  eventId: number
): useEventContacReturn {
  const { updateEvent } = useEventMutations(orgId, eventId);
  const { participantsFuture } = useEventParticipants(orgId, eventId);
  const { addParticipant } = useEventParticipantsMutations(orgId, eventId);

  const removeContact = () => {
    updateEvent({
      contact_id: null,
    });
  };

  const setContact = async (contactId: number) => {
    const eventParticipantsList = participantsFuture.data;
    if (!eventParticipantsList?.find((item) => item.id == contactId)) {
      await addParticipant(contactId);
    }
    updateEvent({
      contact_id: contactId,
    });
  };

  return {
    removeContact,
    setContact,
  };
}
