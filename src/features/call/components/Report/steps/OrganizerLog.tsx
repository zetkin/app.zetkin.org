import { FC, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { LooksOneOutlined } from '@mui/icons-material';

import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { Report, ZetkinCallTarget } from 'features/call/types';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = {
  disableCallerNotes: boolean;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
  target: ZetkinCallTarget;
};

const OrganizerLog: FC<Props> = ({
  onReportUpdate,
  report,
  target,
  disableCallerNotes,
}) => {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
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
          organizerLog: message,
          step: 'callerLog',
        });
      } else if (
        shiftAndEnterPressedTogether &&
        inputRef.current === document.activeElement
      ) {
        onReportUpdate({
          ...report,
          organizerLog: message,
          step: 'callerLog',
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
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [message]);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.organizerLog.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
        <ZUITextField
          helperText={
            !isMobile
              ? messages.report.steps.organizerLog.question.shortcutHint()
              : ''
          }
          inputRef={inputRef}
          label={messages.report.steps.organizerLog.question.messageLabel()}
          multiline
          onChange={(newMessage) => {
            setMessage(newMessage);
          }}
          value={message}
        />
        <ZUIButton
          endIcon={!isMobile ? LooksOneOutlined : undefined}
          label={messages.report.steps.organizerLog.question[
            message ? 'withMessageButton' : 'withoutMessageButton'
          ]()}
          onClick={() => {
            onReportUpdate({
              ...report,
              completed: disableCallerNotes ? true : false,
              organizerLog: message,
              step: 'callerLog',
            });
          }}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default OrganizerLog;
