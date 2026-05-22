import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import { fieldCreate, fieldCreated } from 'features/profile/store';
import { ZetkinCustomField } from 'utils/types/zetkin';
import { CustomFieldPostBody } from '../types';

export default function useCreateField(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: CustomFieldPostBody) => {
    dispatch(fieldCreate());

    const field = await apiClient.post<ZetkinCustomField, CustomFieldPostBody>(
      `/api/orgs/${orgId}/people/fields`,
      data
    );
    dispatch(fieldCreated(field));
  };
}
