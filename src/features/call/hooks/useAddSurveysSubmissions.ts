import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinSurveyCallSubmissionWithSurveyId } from '../types';
import { clearSurveysKeys } from '../store';

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

export default function useAddSurveysSubmissions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submitSurveys = async (
    submissions: ZetkinSurveyCallSubmissionWithSurveyId[]
  ) => {
    const results = await Promise.allSettled(
      submissions.map(({ surveyId, signature, responses }) =>
        apiClient
          .post(`/api/orgs/${orgId}/surveys/${surveyId}/submissions`, {
            responses,
            signature,
          })
          .then<SuccessfulSubmission>(() => ({
            signature,
            success: true,
            surveyId,
          }))
          .catch<FailedSubmission>(() => ({
            error: 'Error with submission',
            signature,
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
