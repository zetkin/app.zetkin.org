import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { Report } from 'features/call/types';
import { QuickResponseButtons } from './QuickResponseButtons';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
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
      <QuickResponseButtons
        options={[
          {
            label: messages.report.steps.successOrFailure.question.yesButton(),
            onSelect: () => {
              onReportUpdate({
                ...report,
                step: 'couldTalk',
                success: true,
              });
            },
          },
          {
            label: messages.report.steps.successOrFailure.question.noButton(),
            onSelect: () => {
              onReportUpdate({
                ...report,
                step: 'failureReason',
                success: false,
              });
            },
          },
        ]}
      />
    </StepBase>
  );
};

export default SuccessOrFailure;
