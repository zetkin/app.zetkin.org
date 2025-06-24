import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';
import submitSurveysRpc from '../rpc/submitSurveys';
import { setSurveySubmissionError } from '../store';

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useAddSurveysSubmissions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submitSurveys = async (submissions: CallSubmissions) => {
    try {
      await apiClient.rpc(submitSurveysRpc, {
        orgId,
        submissions,
      });
      dispatch(setSurveySubmissionError(false));
    } catch (err) {
      dispatch(setSurveySubmissionError(true));
    }
  };

  return { submitSurveys };
}
