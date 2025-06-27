import { Stack } from '@mui/material';
import { FC } from 'react';

import { Report, ZetkinCallTarget } from 'features/call/types';
import { reportSteps } from './reportSteps';

type Props = {
  disableCallerNotes: boolean;
  onReportChange: (report: Report) => void;
  report: Report;
  target: ZetkinCallTarget;
};

const ReportForm: FC<Props> = ({
  disableCallerNotes,
  report,
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
            disableCallerNotes
          );
        }
      })}
    </Stack>
  );
};

export default ReportForm;
