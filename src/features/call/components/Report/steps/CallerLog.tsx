import { FC, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { LooksOneOutlined } from '@mui/icons-material';

import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Report } from 'features/call/types';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const CallerLog: FC<Props> = ({ onReportUpdate, report }) => {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messages = useMessages(messageIds);
  const [message, setMessage] = useState(report.callerLog || '');

  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const onKeyDown = (ev: KeyboardEvent) => {
      keysPressed[ev.key] = true;

      const shiftAndEnterPressedTogether =
        (keysPressed['Shift'] && ev.key === 'Enter') ||
        (keysPressed['Enter'] && ev.key === 'Shift');

      if (ev.key === '1' && inputRef.current !== document.activeElement) {
        onReportUpdate({
          ...report,
          callerLog: message,
          completed: true,
          step: 'summary',
        });
      } else if (
        shiftAndEnterPressedTogether &&
        inputRef.current === document.activeElement
      ) {
        onReportUpdate({
          ...report,
          callerLog: message,
          completed: true,
          step: 'summary',
        });
      }
    };

    const onKeyUp = (ev: KeyboardEvent) => {
      delete keysPressed[ev.key];
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
    };
  }, [message]);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.callerLog.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <ZUITextField
          helperText={
            !isMobile
              ? messages.report.steps.callerLog.question.shortcutHint()
              : ''
          }
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
            onReportUpdate({
              ...report,
              callerLog: message,
              completed: true,
              step: 'summary',
            });
          }}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default CallerLog;
