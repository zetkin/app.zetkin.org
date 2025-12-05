import { useApiClient, useAppDispatch } from 'core/hooks';
import { EventSignupModelType } from '../models';
import { unverifiedSignupDeleted, unverifiedSignupUpdated } from '../store';
import useCreatePerson from 'features/profile/hooks/useCreatePerson';
import useEventParticipantsMutations from './useEventParticipantsMutations';
import { ZetkinCreatePerson } from 'utils/types/zetkin';

type useUnverifiedSignupMutationsReturn = {
  bookUnverifiedSignup: (
    signup: EventSignupModelType,
    personId?: number
  ) => Promise<void>;
  deleteUnverifiedSignup: (signupId: string) => Promise<void>;
  linkSignupToPerson: (
    signupId: string,
    personId: number | null
  ) => Promise<void>;
};

export default function useUnverifiedSignupMutations(
  orgId: number,
  eventId: number
): useUnverifiedSignupMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const createPerson = useCreatePerson(orgId);
  const { addParticipant } = useEventParticipantsMutations(orgId, eventId);

  const deleteUnverifiedSignup = async (signupId: string) => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/events/${eventId}?id=${signupId}`
    );
    dispatch(unverifiedSignupDeleted([eventId, signupId]));
  };

  const linkSignupToPerson = async (
    signupId: string,
    personId: number | null
  ) => {
    const updatedSignup = await apiClient.patch<EventSignupModelType>(
      `/beta/orgs/${orgId}/events/${eventId}?id=${signupId}`,
      { person_id: personId ?? undefined }
    );
    dispatch(unverifiedSignupUpdated([eventId, updatedSignup]));
  };

  const bookUnverifiedSignup = async (
    signup: EventSignupModelType,
    personId?: number
  ) => {
    let finalPersonId = personId || signup.person_id;

    if (!finalPersonId) {
      const personData: ZetkinCreatePerson = {
        email: signup.email ?? null,
        first_name: signup.first_name,
        last_name: signup.last_name,
        phone: signup.phone ?? null,
      };
      const person = await createPerson(personData, []);
      finalPersonId = person.id;
    }

    await addParticipant(finalPersonId);
    await deleteUnverifiedSignup(signup.id);
  };

  return {
    bookUnverifiedSignup,
    deleteUnverifiedSignup,
    linkSignupToPerson,
  };
}
