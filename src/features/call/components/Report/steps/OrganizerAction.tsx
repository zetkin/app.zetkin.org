import { FC } from 'react';

import messageIds from 'features/call/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import StepBase from './StepBase';
import { Report } from 'features/call/types';
import { QuickResponseButtons } from './QuickResponseButtons';

type Props = {
  callLogIsOpen: boolean;
  disableCallerNotes: boolean;
  onReportFinished?: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const OrganizerAction: FC<Props> = ({
  callLogIsOpen,
  disableCallerNotes,
  onReportFinished,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);

  return (
    <StepBase
      state="active"
      title={
        <Msg id={messageIds.report.steps.organizerAction.question.title} />
      }
    >
      <QuickResponseButtons
        callLogIsOpen={callLogIsOpen}
        options={[
          {
            label: messages.report.steps.organizerAction.question.yesButton(),
            onSelect: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: true,
                step: 'organizerLog',
              }),
          },
          {
            label: messages.report.steps.organizerAction.question.noButton(),
            onSelect: () => {
              onReportUpdate({
                ...report,
                completed: disableCallerNotes ? true : false,
                organizerActionNeeded: false,
                step: 'callerLog',
              });
              if (onReportFinished) {
                onReportFinished();
              }
            },
          },
        ]}
      />
    </StepBase>
  );
};

export default OrganizerAction;
