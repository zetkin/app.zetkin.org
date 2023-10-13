import useEventMutations from '../hooks/useEventMutations';
import useEventParticipantsData from './useEventParticipantsData';
import useEventParticipantsMutations from './useEventParticipantsMutations';

type useEventContacReturn = {
  removeContact: () => void;
  setContact: (contactId: number) => void;
};

export default function useEventContact(
  orgId: number,
  eventId: number
): useEventContacReturn {
  const { updateEvent } = useEventMutations(orgId);
  const { participantsFuture } = useEventParticipantsData(orgId, eventId);
  const { addParticipant } = useEventParticipantsMutations(orgId, eventId);

  const removeContact = () => {
    updateEvent(eventId, {
      contact_id: null,
    });
  };

  const setContact = async (contactId: number) => {
    const eventParticipantsList = participantsFuture.data;
    if (!eventParticipantsList?.find((item) => item.id == contactId)) {
      await addParticipant(contactId);
    }
    updateEvent(eventId, {
      contact_id: contactId,
    });
  };

  return {
    removeContact,
    setContact,
  };
}
