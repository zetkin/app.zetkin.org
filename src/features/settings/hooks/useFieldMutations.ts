import { useAppDispatch } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import {
  fieldRemoved,
  fieldUpdate,
  fieldUpdated,
} from 'features/profile/store';
import { ZetkinCustomField } from 'utils/types/zetkin';
import { CustomFieldPatchBody } from '../types';

type UseFieldsMutationReturn = {
  removeField: (fieldId: number) => void;
  updateField: (fieldId: number, data: CustomFieldPatchBody) => void;
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

  const updateField = async (fieldId: number, data: CustomFieldPatchBody) => {
    dispatch(fieldUpdate([fieldId, Object.keys(data)]));

    const field = await apiClient.patch<ZetkinCustomField>(
      `/api/orgs/${orgId}/people/fields/${fieldId}/`,
      data
    );
    dispatch(fieldUpdated(field));
  };

  return { removeField, updateField };
}
