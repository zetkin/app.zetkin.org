import { ZetkinJoinSubmission } from '../types';
import { submissionUpdate, submissionUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseJoinSubmissionMutationsReturn {
  approveSubmission: (submissionId: number) => void;
}

export default function useJoinSubmissionMutations(
  orgId: number
): UseJoinSubmissionMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function approveSubmission(submissionId: number) {
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
