import { Stack } from '@mui/material';
import { FC, useState } from 'react';

import { ZetkinCall, ZetkinCallTarget } from 'features/call/types';
import calculateState from './utils/calculateState';
import { reportSteps } from './reportSteps';
import { useAppDispatch } from 'core/hooks';
import { reportDeleted } from 'features/call/store';

export type Step =
  | 'callBack'
  | 'callerLog'
  | 'couldTalk'
  | 'failureReason'
  | 'leftMessage'
  | 'organizerAction'
  | 'organizerLog'
  | 'successOrFailure'
  | 'summary'
  | 'wrongNumber';

export type Report = {
  callBackAfter: string | null;
  callerLog: string;
  failureReason:
    | 'lineBusy'
    | 'noPickup'
    | 'wrongNumber'
    | 'notAvailable'
    | null;
  leftMessage: boolean;
  organizerActionNeeded: boolean;
  organizerLog: string;
  step: Step;
  success: boolean;
  targetCouldTalk: boolean;
  wrongNumber: 'altPhone' | 'phone' | 'both' | null;
};

type Props = {
  disableCallerNotes: boolean;
  onReportFinished: (
    report: Pick<
      ZetkinCall,
      | 'state'
      | 'notes'
      | 'message_to_organizer'
      | 'organizer_action_needed'
      | 'call_back_after'
    >
  ) => void;
  target: ZetkinCallTarget;
};

const ReportForm: FC<Props> = ({
  disableCallerNotes,
  onReportFinished,
  target,
}) => {
  const dispatch = useAppDispatch();
  const initialReport = sessionStorage.getItem(`report-${target.id}`);

  const [report, setReport] = useState<Report>(
    initialReport
      ? JSON.parse(initialReport)
      : {
          callBackAfter: null,
          callerLog: '',
          failureReason: null,
          leftMessage: false,
          organizerActionNeeded: false,
          organizerLog: '',
          step: 'successOrFailure',
          success: false,
          targetCouldTalk: false,
          wrongNumber: null,
        }
  );

  const handleReportFinished = () => {
    const state = calculateState(report);

    onReportFinished({
      call_back_after: state == 13 || state == 14 ? report.callBackAfter : null,
      message_to_organizer:
        report.organizerActionNeeded && report.organizerLog
          ? report.organizerLog
          : null,
      notes: report.callerLog || null,
      organizer_action_needed: report.organizerActionNeeded,
      state: state,
    });
  };

  const currentStep =
    report.step == 'summary'
      ? 'summary'
      : reportSteps.find((step) => step.name == report.step)?.name;

  let currentStepIndex: number = 0;
  if (currentStep) {
    if (currentStep == 'summary') {
      currentStepIndex = reportSteps.length;
    } else {
      currentStepIndex = reportSteps.findIndex(
        (step) => step.name == currentStep
      );
    }
  }

  const updateReport = (updatedReport: Report) => {
    setReport(updatedReport);
    sessionStorage.setItem(
      `report-${target.id}`,
      JSON.stringify(updatedReport)
    );
  };

  return (
    <Stack>
      {reportSteps.map((step, index) => {
        if (index > currentStepIndex || index == reportSteps.length) {
          return null;
        }

        const renderVariant = step.getRenderVariant(
          report,
          target,
          disableCallerNotes
        );

        if (renderVariant == 'summary') {
          return step.renderSummary(
            report,
            (updatedReport) => {
              dispatch(reportDeleted());
              updateReport(updatedReport);
            },
            target
          );
        }

        if (renderVariant == 'question') {
          return step.renderQuestion(
            report,
            updateReport,
            target,
            handleReportFinished,
            disableCallerNotes
          );
        }
      })}
    </Stack>
  );
};

export default ReportForm;
