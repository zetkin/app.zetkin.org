import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  participantsLoad,
  participantsLoaded,
  unverifiedSignupDeleted,
} from '../store';
import { ZetkinEventParticipant } from 'utils/types/zetkin';

type BookResult = {
  matched: boolean;
  personId: number | null;
};

type BookSignupInput = {
  signupId: string;
};

type LinkResult = {
  personId: number;
  success: boolean;
};

type LinkSignupInput = {
  personId: number;
  signupId: string;
};

type useUnverifiedSignupMutationsReturn = {
  bookSignup: (signupId: string) => Promise<BookResult>;
  deleteUnverifiedSignup: (signupId: string) => Promise<void>;
  linkSignup: (signupId: string, personId: number) => Promise<LinkResult>;
};

export default function useUnverifiedSignupMutations(
  orgId: number,
  eventId: number
): useUnverifiedSignupMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const refreshParticipants = async () => {
    dispatch(participantsLoad(eventId));
    const participants = await apiClient.get<ZetkinEventParticipant[]>(
      `/api/orgs/${orgId}/actions/${eventId}/participants`
    );
    dispatch(participantsLoaded([eventId, participants]));
  };

  const deleteUnverifiedSignup = async (signupId: string) => {
    await apiClient.delete(
      `/beta/orgs/${orgId}/events/${eventId}?id=${signupId}`
    );
    dispatch(unverifiedSignupDeleted([eventId, signupId]));
  };

  const bookSignup = async (signupId: string): Promise<BookResult> => {
    const result = await apiClient.post<BookResult, BookSignupInput>(
      `/beta/orgs/${orgId}/events/${eventId}/book`,
      { signupId }
    );

    if (result.matched) {
      dispatch(unverifiedSignupDeleted([eventId, signupId]));
      await refreshParticipants();
    }

    return result;
  };

  const linkSignup = async (
    signupId: string,
    personId: number
  ): Promise<LinkResult> => {
    const result = await apiClient.post<LinkResult, LinkSignupInput>(
      `/beta/orgs/${orgId}/events/${eventId}/link`,
      { personId, signupId }
    );

    if (result.success) {
      dispatch(unverifiedSignupDeleted([eventId, signupId]));
      await refreshParticipants();
    }

    return result;
  };

  return {
    bookSignup,
    deleteUnverifiedSignup,
    linkSignup,
  };
}
