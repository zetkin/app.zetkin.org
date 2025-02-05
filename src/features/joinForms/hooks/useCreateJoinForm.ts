import { joinFormCreated } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinJoinForm, ZetkinJoinFormPostBody } from '../types';

export default function useCreateJoinForm(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const joinForms = useAppSelector((state) => state.joinForms);

  const createForm = async (
    body: ZetkinJoinFormPostBody
  ): Promise<ZetkinJoinForm> => {
    const createdData = await apiClient.post<ZetkinJoinForm>(
      `/api/orgs/${orgId}/join_forms`,
      body
    );

    dispatch(joinFormCreated(createdData));

    return createdData;
  };

  const recentlyCreatedJoinForm = joinForms.recentlyCreatedJoinForm;

  return {
    createForm,
    recentlyCreatedJoinForm,
  };
}
