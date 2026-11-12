import { useCallback } from 'react';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinSurveyApiSubmission } from 'utils/types/zetkin';
import submitSurveysRpc from '../rpc/submitSurveysAndUpdateCall';
import { reportSubmitted, reportSubmissionErrorAdded } from '../store';
import { CallState, Report } from '../types';
import calculateReportState from '../components/Report/utils/calculateReportState';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { objectToFormData } from '../components/utils/objectToFormData';

type CallSubmissions = {
  submission: ZetkinSurveyApiSubmission;
  surveyId: number;
  targetId: number;
}[];

export default function useSubmitReport(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const submissionDataBySurveyId = useAppSelector(
    (state) =>
      state.call.lanes[state.call.activeLaneIndex].submissionDataBySurveyId
  );

  return useCallback(
    async (callId: number, report: Report, targetId: number) => {
      const submissions: CallSubmissions = Object.entries(
        submissionDataBySurveyId
      )
        .filter(([, surveySubmissionData]) => {
          return Object.entries(surveySubmissionData).some(([, value]) => {
            if (typeof value == 'string') {
              return value.trim() !== '';
            }
            return true;
          });
        })
        .map(([surveyId, surveySubmissionData]) => {
          const surveySubmissionDataAsFormData =
            objectToFormData(surveySubmissionData);
          return {
            submission: prepareSurveyApiSubmission(
              surveySubmissionDataAsFormData
            ),
            surveyId: Number(surveyId),
            targetId,
          };
        });
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
        dispatch(reportSubmissionErrorAdded(result));
      }
    },
    [apiClient, dispatch, orgId, submissionDataBySurveyId]
  );
}
