import useEventMutations from '../hooks/useEventMutations';
import useEventParticipantsData from './useEventParticipantsData';

type useEventContacReturn = {
  removeContact: () => void;
  setContact: (contactId: number) => void;
};

export default function useEventContact(
  orgId: number,
  eventId: number
): useEventContacReturn {
  const { updateEvent } = useEventMutations(orgId, eventId);
  const { addParticipant, getEventParticipants } = useEventParticipants(
    orgId,
    eventId
  );
  const { participantsFuture } = useEventParticipantsData(orgId, eventId);

  const removeContact = () => {
    updateEvent({
      contact_id: null,
    });
  };

  const setContact = async (contactId: number) => {
    const eventParticipantsList = participantsFuture.data;
    if (!eventParticipantsList?.find((item) => item.id == contactId)) {
      await addParticipant(orgId, eventId, contactId);
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
