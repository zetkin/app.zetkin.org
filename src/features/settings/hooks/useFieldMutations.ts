import { useAppDispatch, useAppSelector } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import {
  fieldRemoved,
  fieldUpdate,
  fieldUpdated,
  fieldUpdateErrorAdded,
  fieldUpdateErrorRemoved,
} from 'features/profile/store';
import { ZetkinCustomField } from 'utils/types/zetkin';
import { CustomFieldPatchBody } from '../types';

export default function useFieldMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const fieldUpdateError = useAppSelector(
    (state) => state.profiles.fieldUpdateError
  );

  const removeField = async (fieldId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/people/fields/${fieldId}`);
    dispatch(fieldRemoved(fieldId));
  };

  const updateField = async (fieldId: number, data: CustomFieldPatchBody) => {
    dispatch(fieldUpdate([fieldId, Object.keys(data)]));

    try {
      const field = await apiClient.patch<ZetkinCustomField>(
        `/api/orgs/${orgId}/people/fields/${fieldId}/`,
        data
      );
      dispatch(fieldUpdated(field));
    } catch (e) {
      const updateError = e instanceof Error ? e : new Error('Unknown error');
      const serialized = {
        message: updateError.message,
        name: updateError.name,
      };
      dispatch(fieldUpdateErrorAdded(serialized));
      return updateError;
    }
  };

  const clearFieldUpdateError = () => {
    dispatch(fieldUpdateErrorRemoved());
  };

  return { clearFieldUpdateError, fieldUpdateError, removeField, updateField };
}
