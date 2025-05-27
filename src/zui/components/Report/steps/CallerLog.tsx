import { FC, useState } from 'react';

import { ReportType } from '..';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CallerLog: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState('');

  return (
    <StepBase
      title={<Msg id={messageIds.report.steps.callerLog.question.title} />}
    >
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
        onClick={() =>
          onReportUpdate({ ...report, callerLog: message, step: 'summary' })
        }
        variant="secondary"
      />
    </StepBase>
  );
};

export default CallerLog;
