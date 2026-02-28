import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';
import submitSurveysRpc from '../rpc/submitSurveysAndUpdateCall';
import { reportSubmitted, setReportSubmissionError } from '../store';
import { CallState, Report } from '../types';
import calculateReportState from '../components/Report/utils/calculateReportState';

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useSubmitReport(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (
    callId: number,
    report: Report,
    submissions: CallSubmissions
  ) => {
    const state = calculateReportState(report);
    const reportData = {
      call_back_after:
        state == CallState.CALL_BACK || state == CallState.NOT_AVAILABLE
          ? report.callBackAfter
          : null,
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
    if (result.kind == 'success') {
      dispatch(reportSubmitted(result.updatedCall));
    } else {
      dispatch(setReportSubmissionError(result));
    }
  };
}
