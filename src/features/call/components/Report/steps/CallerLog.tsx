import { FC, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { LooksOneOutlined } from '@mui/icons-material';

import { Report } from '..';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = {
  onReportFinished: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const CallerLog: FC<Props> = ({ onReportFinished, onReportUpdate, report }) => {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState(report.callerLog || '');

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1' && inputRef.current != document.activeElement) {
        onReportUpdate({ ...report, callerLog: message, step: 'summary' });
        onReportFinished();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [message]);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.callerLog.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <ZUITextField
          inputRef={inputRef}
          label={messages.report.steps.callerLog.question.noteLabel()}
          multiline
          onChange={(newMessage) => setMessage(newMessage)}
          value={message}
        />
        <ZUIButton
          endIcon={!isMobile ? LooksOneOutlined : undefined}
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
