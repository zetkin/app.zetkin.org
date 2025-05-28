import { FC } from 'react';

import { Report } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

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
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.leftMessage.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'organizerAction',
              }),
          },
          {
            label: messages.report.steps.leftMessage.question.noButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'organizerAction',
              }),
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default LeftMessage;
