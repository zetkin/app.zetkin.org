import { FC, useState } from 'react';
import { Stack } from '@mui/system';

import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  initialMessage?: string;
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const OrganizerLog: FC<Props> = ({
  initialMessage,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState(initialMessage || '');

  return (
    <StepBase
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
