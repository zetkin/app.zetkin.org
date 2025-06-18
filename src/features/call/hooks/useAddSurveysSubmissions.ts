import { useApiClient, useAppDispatch } from 'core/hooks';
import { clearSurveysKeys } from '../store';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';
import submitSurveysRpc from '../rpc/submitSurveys';

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useAddSurveysSubmissions(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submitSurveys = async (
    submissions: CallSubmissions
  ): Promise<boolean> => {
    try {
      const result = await apiClient.rpc(submitSurveysRpc, {
        orgId,
        submissions,
      });

      result.forEach(({ surveyId, targetId }) => {
        localStorage.removeItem(`formContent-${surveyId}-${targetId}`);
      });

      if (result.length) {
        dispatch(clearSurveysKeys());
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  return { submitSurveys };
}
