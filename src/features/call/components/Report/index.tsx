import { Stack } from '@mui/material';
import { FC } from 'react';

import { LaneStep, Report, ZetkinCallTarget } from 'features/call/types';
import { reportSteps } from './reportSteps';

type Props = {
  callLogIsOpen: boolean;
  disableCallerNotes: boolean;
  laneStep: LaneStep;
  onReportChange: (report: Report) => void;
  report: Report;
  target: ZetkinCallTarget;
};

const ReportForm: FC<Props> = ({
  callLogIsOpen,
  disableCallerNotes,
  report,
  laneStep,
  onReportChange,
  target,
}) => {
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

  return (
    <Stack>
      {laneStep == LaneStep.REPORT &&
        reportSteps.map((step, index) => {
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
                onReportChange(updatedReport);
              },
              target
            );
          }

          if (renderVariant == 'question') {
            return step.renderQuestion(
              report,
              onReportChange,
              target,
              disableCallerNotes,
              callLogIsOpen
            );
          }
        })}
    </Stack>
  );
};

export default ReportForm;
