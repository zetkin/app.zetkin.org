import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { Report } from 'features/call/types';
import { Option, QuickResponseButtons } from './QuickResponseButtons';

type Props = {
  nextStepIfWrongNumber: 'wrongNumber' | 'organizerLog';
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const FailureReason: FC<Props> = ({
  nextStepIfWrongNumber,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);

  const options: Option[] = [
    {
      label: messages.report.steps.failureReason.question.noPickup(),
      onSelect: () =>
        onReportUpdate({
          ...report,
          failureReason: 'noPickup',
          step: 'leftMessage',
        }),
    },
    {
      label: messages.report.steps.failureReason.question.wrongNumber(),
      onSelect: () =>
        onReportUpdate({
          ...report,
          failureReason: 'wrongNumber',
          organizerActionNeeded: true,
          step: nextStepIfWrongNumber,
          wrongNumber: 'phone',
        }),
    },
    {
      label: messages.report.steps.failureReason.question.lineBusy(),
      onSelect: () =>
        onReportUpdate({
          ...report,
          failureReason: 'lineBusy',
          step: 'organizerAction',
        }),
    },
    {
      label: messages.report.steps.failureReason.question.notAvailable(),
      onSelect: () =>
        onReportUpdate({
          ...report,
          failureReason: 'notAvailable',
          step: 'callBack',
        }),
    },
  ];

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.failureReason.question.title} />}
    >
      <QuickResponseButtons options={options} />
    </StepBase>
  );
};

export default FailureReason;
