import { ZetkinJoinSubmission } from '../types';
import {
  submissionDeleted,
  submissionUpdate,
  submissionUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseJoinSubmissionMutationsReturn {
  approveSubmission: (submissionId: number) => void;
  deleteSubmission: (submissionId: number) => void;
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

  async function deleteSubmission(submissionId: number) {
    await apiClient.delete(
      `/api/orgs/${orgId}/join_submissions/${submissionId}`
    );
    dispatch(submissionDeleted(submissionId));
  }

  return {
    approveSubmission,
    deleteSubmission,
  };
}
