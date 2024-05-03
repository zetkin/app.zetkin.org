import { emailCreate, emailCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEmail, ZetkinEmailPostBody } from 'utils/types/zetkin';

interface UseCreateEmailReturn {
  createEmail: (body: ZetkinEmailPostBody) => Promise<ZetkinEmail>;
}

export default function useCreateEmail(orgId: number): UseCreateEmailReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEmail = async (body: ZetkinEmailPostBody) => {
    dispatch(emailCreate);
    const email = await apiClient.post<ZetkinEmail, ZetkinEmailPostBody>(
      `/api/orgs/${orgId}/emails`,
      body
    );
    dispatch(emailCreated(email));
    return email;
  };

  return { createEmail };
}
