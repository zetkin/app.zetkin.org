import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';
import submitSurveysRpc, { Result } from '../rpc/submitSurveysAndUpdateCall';
import {
  reportSubmitted,
  setSurveySubmissionError,
  setUpdateCallError,
} from '../store';
import { Report } from '../types';
import calculateReportState from '../components/Report/utils/calculateReportState';

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useSubmitReport(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const submitReport = async (
    callId: number,
    report: Report,
    submissions: CallSubmissions
  ): Promise<Result> => {
    const state = calculateReportState(report);
    const reportData = {
      call_back_after: state === 13 || state === 14 ? report.callBackAfter : null,
      message_to_organizer:
        report.organizerActionNeeded && report.organizerLog
          ? report.organizerLog
          : null,
      notes: report.callerLog || null,
      organizer_action_needed: report.organizerActionNeeded,
      state: state,
    };

    const result = await apiClient.rpc(submitSurveysRpc, {
      callId,
      orgId,
      reportData,
      submissions,
    });
    if (result.kind === 'success') {
      dispatch(reportSubmitted(result.updatedCall));
      return result;
    } else if (result.kind === 'submissionError') {
      dispatch(setSurveySubmissionError(true));
      return result;
    } else if (result.kind === 'updateError') {
      dispatch(setUpdateCallError(true));
      return result;
    } else {
      // This should never happen, but we return the result to satisfy TypeScript's checker
      return result;
    }
  };

  return { submitReport };
}
