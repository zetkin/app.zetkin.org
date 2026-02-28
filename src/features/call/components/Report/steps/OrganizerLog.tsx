import { FC, useEffect, useMemo, useRef } from 'react';
import { Stack } from '@mui/material';
import { LooksOneOutlined } from '@mui/icons-material';

import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { Report, ZetkinCallTarget } from 'features/call/types';
import useIsMobile from 'utils/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { updatePendingOrgLog } from 'features/call/store';

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
  const dispatch = useAppDispatch();

  const organizerLog = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].pendingOrgLog
  );

  const initialMessage = useMemo(() => {
    if (organizerLog) {
      return organizerLog;
    } else if (report.organizerLog) {
      return report.organizerLog;
    } else if (!report.organizerLog && report.wrongNumber) {
      const phone = target.phone || '';
      const altPhone = target.alt_phone || '';

      return messages.report.steps.organizerLog.question.wrongNumberMessages[
        report.wrongNumber
      ]({ altPhone, phone });
    } else {
      return '';
    }
  }, []);

  useEffect(() => {
    dispatch(updatePendingOrgLog(initialMessage));
  }, []);

  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const onKeyDown = (ev: KeyboardEvent) => {
      keysPressed[ev.key] = true;

      const shiftAndEnterPressedTogether =
        (keysPressed['Shift'] && ev.key == 'Enter') ||
        (keysPressed['Enter'] && ev.key == 'Shift');

      if (ev.key == '1' && inputRef.current != document.activeElement) {
        onReportUpdate({
          ...report,
          organizerLog,
          step: 'callerLog',
        });
      } else if (
        shiftAndEnterPressedTogether &&
        inputRef.current == document.activeElement
      ) {
        onReportUpdate({
          ...report,
          organizerLog,
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
  }, [organizerLog]);

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
            dispatch(updatePendingOrgLog(newMessage));
          }}
          value={organizerLog}
        />
        <ZUIButton
          endIcon={!isMobile ? LooksOneOutlined : undefined}
          label={messages.report.steps.organizerLog.question[
            organizerLog ? 'withMessageButton' : 'withoutMessageButton'
          ]()}
          onClick={() => {
            onReportUpdate({
              ...report,
              completed: disableCallerNotes ? true : false,
              organizerLog: organizerLog,
              step: 'callerLog',
            });
            dispatch(updatePendingOrgLog(''));
          }}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default OrganizerLog;
