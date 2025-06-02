import { FC, useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { LooksOne } from '@mui/icons-material';

import { Report } from '..';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import { ZetkinCallTarget } from 'features/call/types';

type Props = {
  onReportFinished?: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
  target: ZetkinCallTarget;
};

const OrganizerLog: FC<Props> = ({
  onReportFinished,
  onReportUpdate,
  report,
  target,
}) => {
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
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        onReportUpdate({
          ...report,
          organizerLog: message,
          step: 'callerLog',
        });
        if (onReportFinished) {
          onReportFinished();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <StepBase
      state="active"
      title={<Msg id={messageIds.report.steps.organizerLog.question.title} />}
    >
      <Stack sx={{ gap: '0.5rem' }}>
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
          onClick={() => {
            onReportUpdate({
              ...report,
              organizerLog: message,
              step: 'callerLog',
            });
            if (onReportFinished) {
              onReportFinished();
            }
          }}
          startIcon={LooksOne}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default OrganizerLog;
