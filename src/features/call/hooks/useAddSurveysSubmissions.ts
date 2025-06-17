import { useApiClient, useAppDispatch } from 'core/hooks';
import { clearSurveysKeys } from '../store';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';

type SuccessfulSubmission = {
  signature: number;
  success: true;
  surveyId: number;
};

type FailedSubmission = {
  error: string;
  signature: number;
  success: false;
  surveyId: number;
};

type SubmissionResult = SuccessfulSubmission | FailedSubmission;

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useAddSurveysSubmissions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submitSurveys = async (submissions: CallSubmissions) => {
    const results = await Promise.allSettled(
      submissions.map(({ surveyId, targetId, submission }) =>
        apiClient
          .post(`/api/orgs/${orgId}/surveys/${surveyId}/submissions`, {
            responses: submission.responses,
            signature: targetId,
          })
          .then<SuccessfulSubmission>(() => ({
            signature: targetId,
            success: true,
            surveyId,
          }))
          .catch<FailedSubmission>(() => ({
            error: 'Error with submission',
            signature: targetId,
            success: false,
            surveyId,
          }))
      )
    );

    const isSuccessful = (
      result: PromiseSettledResult<SubmissionResult>
    ): result is PromiseFulfilledResult<SuccessfulSubmission> =>
      result.status === 'fulfilled' && result.value.success === true;

    const successful = results.filter(isSuccessful);

    successful.forEach(({ value: { surveyId, signature } }) => {
      localStorage.removeItem(`formContent-${surveyId}-${signature}`);
    });

    if (successful.length > 0) {
      dispatch(clearSurveysKeys());
    }

    return results;
  };

  return { submitSurveys };
}
