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

const CouldTalk: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);

  return (
    <StepBase
      state="active"
      title={
        <Msg
          id={messageIds.report.steps.couldTalk.question.title}
          values={{ firstName }}
        />
      }
    >
      <QuickResponseButtons
        options={[
          {
            label: messages.report.steps.couldTalk.question.yesButton(),
            onSelect: () => {
              onReportUpdate({
                ...report,
                step: 'organizerAction',
                targetCouldTalk: true,
              });
            },
          },
          {
            label: messages.report.steps.couldTalk.question.noButton(),
            onSelect: () => {
              onReportUpdate({
                ...report,
                step: 'callBack',
                targetCouldTalk: false,
              });
            },
          },
        ]}
      />
    </StepBase>
  );
};

export default CouldTalk;
