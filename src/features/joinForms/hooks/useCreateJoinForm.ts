import { joinFormCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinJoinForm, ZetkinJoinFormPostBody } from '../types';

export default function useCreateJoinForm(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function createForm(body: ZetkinJoinFormPostBody) {
    const createdData = await apiClient.post<ZetkinJoinForm>(
      `/api/orgs/${orgId}/join_forms`,
      body
    );

    dispatch(joinFormCreated(createdData));

    return createdData;
  }

  return {
    createForm,
  };
}
