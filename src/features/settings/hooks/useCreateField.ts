import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import { fieldCreate, fieldCreated } from 'features/profile/store';
import { CUSTOM_FIELD_TYPE, ZetkinCustomField } from 'utils/types/zetkin';

type UseCreateFieldsReturn = {
  createField: (title: string) => void;
};

export default function useCreateField(orgId: number): UseCreateFieldsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createField = async (title: string) => {
    dispatch(fieldCreate());

    const field = await apiClient.post<ZetkinCustomField>(
      `/api/orgs/${orgId}/people/fields/`,
      {
        slug: title.toLowerCase().replace(/\s+/g, '_'),
        title,
        type: 'text' as CUSTOM_FIELD_TYPE,
      }
    );
    dispatch(fieldCreated(field));
  };

  return { createField };
}
