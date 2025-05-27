import { FC } from 'react';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  nextStepIfWrongNumber: 'wrongNumber' | 'orgLog';
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const FailureReason: FC<Props> = ({
  nextStepIfWrongNumber,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      title={<Msg id={messageIds.report.steps.failureReason.question.title} />}
    >
      <ZUIButton
        label={messages.report.steps.failureReason.question.noPickup()}
        onClick={() => {
          if (onReportUpdate) {
            onReportUpdate({
              ...report,
              failureReason: 'noPickup',
              step: 'leftMessage',
            });
          }
        }}
        variant="secondary"
      />
      <ZUIButton
        label={messages.report.steps.failureReason.question.wrongNumber()}
        onClick={() => {
          if (onReportUpdate) {
            onReportUpdate({
              ...report,
              failureReason: 'wrongNumber',
              organizerActionNeeded: true,
              step: nextStepIfWrongNumber,
              wrongNumber: 'phone',
            });
          }
        }}
        variant="secondary"
      />
      <ZUIButton
        label={messages.report.steps.failureReason.question.lineBusy()}
        onClick={() => {
          if (onReportUpdate) {
            onReportUpdate({
              ...report,
              failureReason: 'lineBusy',
              step: 'orgAction',
            });
          }
        }}
        variant="secondary"
      />
      <ZUIButton
        label={messages.report.steps.failureReason.question.notAvailable()}
        onClick={() => {
          if (onReportUpdate) {
            onReportUpdate({
              ...report,
              failureReason: 'notAvailable',
              step: 'callBack',
            });
          }
        }}
        variant="secondary"
      />
    </StepBase>
  );
};

export default FailureReason;
