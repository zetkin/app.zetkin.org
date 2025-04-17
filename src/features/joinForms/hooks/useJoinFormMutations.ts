import { joinFormUpdate, joinFormUpdated, joinFormDeleted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinJoinForm, ZetkinJoinFormPatchBody } from '../types';

export default function useJoinFormMutations(orgId: number, formId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function updateForm(body: ZetkinJoinFormPatchBody) {
    dispatch(joinFormUpdate([formId, Object.keys(body)]));

    const updatedData = await apiClient.patch<ZetkinJoinForm>(
      `/api/orgs/${orgId}/join_forms/${formId}`,
      body
    );

    dispatch(joinFormUpdated(updatedData));
  }

  async function deleteForm() {
    await apiClient.delete(`/api/orgs/${orgId}/join_forms/${formId}`);
    dispatch(joinFormDeleted(formId));
  }

  return {
    deleteForm,
    updateForm,
  };
}
