import { ZetkinJoinSubmission } from '../types';
import { submissionUpdate, submissionUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useJoinSubmissionMutations(
  orgId: number,
  submissionId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function approveSubmission() {
    dispatch(submissionUpdate([submissionId, ['accepted']]));

    const data = await apiClient.patch<ZetkinJoinSubmission>(
      `/api/orgs/${orgId}/join_submissions/${submissionId}`,
      { state: 'accepted' }
    );

    dispatch(submissionUpdated(data));
  }

  return {
    approveSubmission,
  };
}
