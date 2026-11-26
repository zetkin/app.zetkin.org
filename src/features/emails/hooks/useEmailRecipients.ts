import { z } from 'zod';

import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { recipientsError, recipientsLoad, recipientsLoaded } from '../store';
import { DeliveryLogRecipient } from '../types';
import { serializeError } from 'utils/storeUtils/serializeError';

const recipientSchema: z.ZodType<DeliveryLogRecipient> = z.object({
  delivered: z.string().nullable(),
  email_address: z.string().nullable(),
  error: z.string().nullable(),
  id: z.number().int().positive(),
  opened: z.string().nullable(),
  person: z.object({
    first_name: z.string(),
    id: z.number().int().positive(),
    last_name: z.string(),
  }),
  sent: z.string().nullable(),
  status: z.enum([
    'pending',
    'sent',
    'delivered',
    'opened',
    'failed',
    'bounced',
  ]),
});

export default function useEmailRecipients(
  orgId: number,
  emailId: number
): IFuture<DeliveryLogRecipient[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const recipients = useAppSelector(
    (state) => state.emails.recipientsByEmailId[emailId]
  );

  const future = loadListIfNecessary(recipients, dispatch, {
    actionOnError: (error) => recipientsError([emailId, serializeError(error)]),
    actionOnLoad: () => recipientsLoad(emailId),
    actionOnSuccess: (loadedRecipients) =>
      recipientsLoaded([emailId, loadedRecipients]),
    loader: async () => {
      const response = await apiClient.get<DeliveryLogRecipient[]>(
        `/api/orgs/${orgId}/emails/${emailId}/recipients`
      );
      return recipientSchema.array().parse(response);
    },
  });

  if (future.error && !future.isLoading) {
    return { data: null, error: future.error, isLoading: false };
  }

  return future;
}
