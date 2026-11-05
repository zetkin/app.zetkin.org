import { useApiClient, useAppDispatch } from 'core/hooks';
import { configCreate, configCreated } from 'features/emails/store';
import { ZetkinEmailConfig } from 'utils/types/zetkin';

export default function useCreateEmailChannel(orgId: number) {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();

  return async (
    body: Omit<ZetkinEmailConfig, 'id' | 'organization'> & {
      domain: string;
    }
  ) => {
    dispatch(configCreate());
    const newConfig = await apiClient.post<ZetkinEmailConfig>(
      `/api/orgs/${orgId}/emails/configs`,
      body
    );
    dispatch(configCreated(newConfig));
  };
}
