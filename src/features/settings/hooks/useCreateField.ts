import { useAppDispatch, useAppSelector } from 'core/hooks';
import useApiClient from 'core/hooks/useApiClient';
import {
  fieldCreate,
  fieldCreated,
  fieldCreateErrorAdded,
  fieldCreateErrorRemoved,
} from 'features/profile/store';
import { ZetkinCustomField } from 'utils/types/zetkin';
import { CustomFieldPostBody } from '../types';

export default function useCreateField(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const fieldCreateError = useAppSelector(
    (state) => state.profiles.fieldCreateError
  );

  const createField = async (data: CustomFieldPostBody) => {
    dispatch(fieldCreate());

    try {
      const field = await apiClient.post<
        ZetkinCustomField,
        CustomFieldPostBody
      >(`/api/orgs/${orgId}/people/fields`, data);
      dispatch(fieldCreated(field));
    } catch (err) {
      const createError =
        err instanceof Error ? err : new Error('Unknown error');
      const serialized = {
        message: createError.message,
        name: createError.name,
      };
      dispatch(fieldCreateErrorAdded(serialized));
      return createError;
    }
  };

  const clearFieldCreateError = () => {
    dispatch(fieldCreateErrorRemoved());
  };

  return { clearFieldCreateError, createField, fieldCreateError };
}
