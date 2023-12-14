import { ZetkinEmail } from 'utils/types/zetkin';
import { emailCreate, emailCreated } from '../store';
// import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseCreateEmailReturn {
  // createEmail: (body: Partial<ZetkinEmail>) => ZetkinEmail;
  createEmail: (body: Partial<ZetkinEmail>) => Promise<ZetkinEmail>;
}

export default function useCreateEmail(
  orgId: number,
  campId: number
): UseCreateEmailReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEmail = async (body: Partial<ZetkinEmail>) => {
    dispatch(emailCreate);
    const email = await apiClient.post<ZetkinEmail, Partial<ZetkinEmail>>(
      `/api/orgs/${orgId}/emails`,
      {
        campaign_id: campId,
        title: body.title,
      }
    );
    dispatch(emailCreated([email, campId]));
    return email;
  };

  return { createEmail };
}
