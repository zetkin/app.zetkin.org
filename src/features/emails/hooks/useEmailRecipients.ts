import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { recipientsError, recipientsLoad, recipientsLoaded } from '../store';
import { DeliveryLogRecipient } from '../types';
import { serializeError } from 'utils/storeUtils/serializeError';

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
    loader: () =>
      apiClient.get<DeliveryLogRecipient[]>(
        `/api/orgs/${orgId}/emails/${emailId}/recipients`
      ),
  });

  if (future.error && !future.isLoading) {
    return { data: null, error: future.error, isLoading: false };
  }

  return future;
}
