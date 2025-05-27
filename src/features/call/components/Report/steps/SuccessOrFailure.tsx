import { FC } from 'react';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { ReportType } from '..';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const SuccessOrFailure: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <StepBase
      state="active"
      title={
        <Msg
          id={messageIds.report.steps.successOrFailure.question.title}
          values={{
            firstName,
          }}
        />
      }
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.successOrFailure.question.yesButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'couldTalk',
                  success: true,
                });
              }
            },
          },
          {
            label: messages.report.steps.successOrFailure.question.noButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'failureReason',
                  success: false,
                });
              }
            },
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default SuccessOrFailure;
