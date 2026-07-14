import { FC } from 'react';

import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { Report } from 'features/call/types';
import { QuickResponseButtons } from './QuickResponseButtons';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.leftMessage.question.title} />}
    >
      <QuickResponseButtons
        options={[
          {
            label: messages.report.steps.leftMessage.question.yesButton(),
            onSelect: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'organizerAction',
              }),
          },
          {
            label: messages.report.steps.leftMessage.question.noButton(),
            onSelect: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'organizerAction',
              }),
          },
        ]}
      />
    </StepBase>
  );
};

export default LeftMessage;
