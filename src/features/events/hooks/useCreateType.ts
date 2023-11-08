import { ZetkinActivity } from 'utils/types/zetkin';
import { typeAdd, typeAdded } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useCreateType(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const addType = (title: string) => {
    dispatch(typeAdd([orgId, { title }]));
    apiClient
      .post<ZetkinActivity>(`/api/orgs/${orgId}/activities`, { title })
      .then((event) => {
        dispatch(typeAdded(event));
      });
  };

  return { addType };
}
