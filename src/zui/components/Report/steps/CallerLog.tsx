import { FC, useState } from 'react';
import { Stack } from '@mui/system';

import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CallerLog: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState('');

  return (
    <Stack gap="1rem">
      <ZUIText>
        <Msg id={messageIds.report.steps.callerLog.question.title} />
      </ZUIText>
      <ZUITextField
        multiline
        onChange={(newMessage) => setMessage(newMessage)}
        value={message}
      />
      <ZUIButton
        label={messages.report.steps.callerLog.question[
          message ? 'saveWithNoteButton' : 'saveWithoutNoteButton'
        ]()}
        onClick={() =>
          onReportUpdate({ ...report, callerLog: message, step: 'summary' })
        }
        variant="secondary"
      />
    </Stack>
  );
};

export default CallerLog;
