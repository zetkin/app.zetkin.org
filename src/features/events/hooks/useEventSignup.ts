import useEventBookings from './useEventBookings';
import useEventSignups from './useEventSignups';
import useMemberships from 'features/campaigns/hooks/useMemberships';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { signupAdd, signupAdded, signupRemove, signupRemoved } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinEvent,
  ZetkinEventResponse,
  ZetkinMembership,
} from 'utils/types/zetkin';

export type EventResponseState =
  | 'notSignedUp'
  | 'signedUp'
  | 'booked'
  | 'notInOrgYet';

function eventResponseState(
  eventId: number,
  bookings: ZetkinEvent[],
  membership: ZetkinMembership,
  signups: ZetkinEventResponse[]
): EventResponseState {
  if (!membership) {
    return 'notInOrgYet';
  }
  if (bookings.some((b) => b.id == eventId)) {
    return 'booked';
  }
  if (signups.some((b) => b.action_id == eventId)) {
    return 'signedUp';
  }
  return 'notSignedUp';
}

type UseEventSignupReturn = {
  myResponseState: EventResponseState;
  signup: () => Promise<void>;
  undoSignup: () => Promise<void>;
};

export default function useEventSignup(
  orgId: number,
  eventId: number
): IFuture<UseEventSignupReturn> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const bookingsFuture = useEventBookings();
  const membershipsFuture = useMemberships();
  const signupsFuture = useEventSignups();

  const allFutures: IFuture<unknown>[] = [
    bookingsFuture,
    membershipsFuture,
    signupsFuture,
  ];

  if (allFutures.some((f) => f.isLoading)) {
    return new LoadingFuture();
  }
  if (allFutures.some((f) => f.error)) {
    return new ErrorFuture('Error loading bookings');
  }

  // TODO: handle "missing" user
  const membership = membershipsFuture.data!.find(
    (m) => m.organization.id == orgId
  );

  const signup = async () => {
    dispatch(signupAdd());
    await apiClient.put<ZetkinEvent>(
      `/api/orgs/${orgId}/actions/${eventId}/responses/${membership?.profile.id}`
    );
    dispatch(
      signupAdded({
        action_id: eventId,
        id: membership!.profile.id,
        person: membership!.profile,
        response_date: new Date().toUTCString(),
      })
    );
  };
  const undoSignup = async () => {
    dispatch(signupRemove());
    await apiClient.delete(
      `/api/orgs/${orgId}/actions/${eventId}/responses/${membership?.profile.id}`
    );
    dispatch(signupRemoved(eventId));
  };

  return new ResolvedFuture({
    myResponseState: eventResponseState(
      eventId,
      bookingsFuture.data!,
      membership!,
      signupsFuture.data!
    ),
    signup,
    undoSignup,
  });
}
