import { FC, useState } from 'react';

import { ReportType } from '..';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';
import { ZetkinCallTarget } from 'features/call/types';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
  target: ZetkinCallTarget;
};

const OrganizerLog: FC<Props> = ({ onReportUpdate, report, target }) => {
  const messages = useMessages(messageIds);
  let initialMessage = '';

  if (report.organizerLog) {
    initialMessage = report.organizerLog;
  } else if (!report.organizerLog && report.wrongNumber) {
    const phone = target.phone || '';
    const altPhone = target.alt_phone || '';

    initialMessage =
      messages.report.steps.organizerLog.question.wrongNumberMessages[
        report.wrongNumber
      ]({ altPhone, phone });
  }

  const [message, setMessage] = useState(initialMessage);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.organizerLog.question.title} />}
    >
      <ZUITextField
        label={messages.report.steps.organizerLog.question.messageLabel()}
        multiline
        onChange={(newMessage) => setMessage(newMessage)}
        value={message}
      />
      <ZUIButton
        label={messages.report.steps.organizerLog.question[
          message ? 'withMessageButton' : 'withoutMessageButton'
        ]()}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerLog: message,
            step: 'callerLog',
          })
        }
        variant="secondary"
      />
    </StepBase>
  );
};

export default OrganizerLog;
