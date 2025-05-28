import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import { Report } from '..';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportFinished: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const CallerLog: FC<Props> = ({ onReportFinished, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState(report.callerLog || '');

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.callerLog.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <ZUITextField
          label={messages.report.steps.callerLog.question.noteLabel()}
          multiline
          onChange={(newMessage) => setMessage(newMessage)}
          value={message}
        />
        <ZUIButton
          label={messages.report.steps.callerLog.question[
            message ? 'saveWithNoteButton' : 'saveWithoutNoteButton'
          ]()}
          onClick={() => {
            onReportUpdate({ ...report, callerLog: message, step: 'summary' });
            onReportFinished();
          }}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default CallerLog;
