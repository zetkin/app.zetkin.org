import { useCallback } from 'react';

import { emailCreate, emailCreatedNoRedirect } from 'features/emails/store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEmail } from 'utils/types/zetkin';
import createEmailFromEventParticipants from 'features/events/rpc/createEmailFromEventParticipants';

export type EmailToEventParticipantsParams = {
  emailTitle: string;
  eventId: number;
  orgId: number;
};

export default function useCreateEmailFromEventParticipants(
  orgId: number
): (params: EmailToEventParticipantsParams) => Promise<ZetkinEmail> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return useCallback(
    async (params: EmailToEventParticipantsParams) => {
      dispatch(emailCreate);
      const email = await apiClient.rpc<
        EmailToEventParticipantsParams,
        ZetkinEmail
      >(createEmailFromEventParticipants, params);
      dispatch(emailCreatedNoRedirect(email));
      return email;
    },
    [orgId]
  );
}
