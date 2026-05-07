import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import { fieldCreate, fieldCreated } from 'features/profile/store';
import {
  CUSTOM_FIELD_TYPE,
  EnumChoice,
  ZetkinCustomField,
} from 'utils/types/zetkin';

type UseCreateFieldsReturn = {
  createField: (
    title: string,
    type: CUSTOM_FIELD_TYPE,
    enumChoices?: EnumChoice[]
  ) => void;
};

export default function useCreateField(orgId: number): UseCreateFieldsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createField = async (
    title: string,
    type: CUSTOM_FIELD_TYPE,
    enumChoices?: EnumChoice[]
  ) => {
    dispatch(fieldCreate());

    const field = await apiClient.post<ZetkinCustomField>(
      `/api/orgs/${orgId}/people/fields/`,
      {
        enum_choices: enumChoices,
        slug: title.toLowerCase().replace(/\s+/g, '_'),
        title,
        type: type,
      }
    );
    dispatch(fieldCreated(field));
  };

  return { createField };
}
