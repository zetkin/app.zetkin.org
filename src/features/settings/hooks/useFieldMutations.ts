import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import {
  fieldRemoved,
  fieldUpdate,
  fieldUpdated,
} from 'features/profile/store';
import {
  CUSTOM_FIELD_TYPE,
  EnumChoice,
  ZetkinCustomField,
} from 'utils/types/zetkin';

type UseFieldsMutationReturn = {
  removeField: (fieldId: number) => void;
  updateField: (
    data: {
      enum_choices?: EnumChoice[];
      slug?: string;
      title?: string;
      type?: CUSTOM_FIELD_TYPE;
    },
    fieldId: number
  ) => void;
};

export default function useFieldMutations(
  orgId: number
): UseFieldsMutationReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const removeField = async (fieldId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/people/fields/${fieldId}`);
    dispatch(fieldRemoved(fieldId));
  };

  const updateField = async (
    data: {
      enum_choices?: EnumChoice[];
      slug?: string;
      title?: string;
      type?: CUSTOM_FIELD_TYPE;
    },
    fieldId: number
  ) => {
    dispatch(fieldUpdate([fieldId, ['enum_choices', 'slug', 'title', 'type']]));

    const field = await apiClient.patch<ZetkinCustomField>(
      `/api/orgs/${orgId}/people/fields/${fieldId}/`,
      data
    );
    dispatch(fieldUpdated(field));
  };

  return { removeField, updateField: updateField };
}
