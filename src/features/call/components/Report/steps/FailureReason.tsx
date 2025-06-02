import { FC, useEffect } from 'react';
import { Stack } from '@mui/material';
import { Looks3, Looks4, LooksOne, LooksTwo } from '@mui/icons-material';

import { Report } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  nextStepIfWrongNumber: 'wrongNumber' | 'organizerLog';
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const FailureReason: FC<Props> = ({
  nextStepIfWrongNumber,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            failureReason: 'noPickup',
            step: 'leftMessage',
          });
        }
      } else if (ev.key == '2') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            failureReason: 'wrongNumber',
            organizerActionNeeded: true,
            step: nextStepIfWrongNumber,
            wrongNumber: 'phone',
          });
        }
      } else if (ev.key == '3') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            failureReason: 'lineBusy',
            step: 'organizerAction',
          });
        }
      } else if (ev.key == '4') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            failureReason: 'notAvailable',
            step: 'callBack',
          });
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
      title={<Msg id={messageIds.report.steps.failureReason.question.title} />}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: '0.5rem' }}>
        <ZUIButton
          label={messages.report.steps.failureReason.question.noPickup()}
          onClick={() => {
            if (onReportUpdate) {
              onReportUpdate({
                ...report,
                failureReason: 'noPickup',
                step: 'leftMessage',
              });
            }
          }}
          startIcon={LooksOne}
          variant="secondary"
        />
        <ZUIButton
          label={messages.report.steps.failureReason.question.wrongNumber()}
          onClick={() => {
            if (onReportUpdate) {
              onReportUpdate({
                ...report,
                failureReason: 'wrongNumber',
                organizerActionNeeded: true,
                step: nextStepIfWrongNumber,
                wrongNumber: 'phone',
              });
            }
          }}
          startIcon={LooksTwo}
          variant="secondary"
        />
        <ZUIButton
          label={messages.report.steps.failureReason.question.lineBusy()}
          onClick={() => {
            if (onReportUpdate) {
              onReportUpdate({
                ...report,
                failureReason: 'lineBusy',
                step: 'organizerAction',
              });
            }
          }}
          startIcon={Looks3}
          variant="secondary"
        />
        <ZUIButton
          label={messages.report.steps.failureReason.question.notAvailable()}
          onClick={() => {
            if (onReportUpdate) {
              onReportUpdate({
                ...report,
                failureReason: 'notAvailable',
                step: 'callBack',
              });
            }
          }}
          startIcon={Looks4}
          variant="secondary"
        />
      </Stack>
    </StepBase>
  );
};

export default FailureReason;
