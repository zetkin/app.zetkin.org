import { FC, useEffect } from 'react';
import { LooksOne, LooksTwo } from '@mui/icons-material';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Report } from '..';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const SuccessOrFailure: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            step: 'couldTalk',
            success: true,
          });
        }
      } else if (ev.key == '2') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            step: 'failureReason',
            success: false,
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
      title={
        <Msg
          id={messageIds.report.steps.successOrFailure.question.title}
          values={{
            firstName,
          }}
        />
      }
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.successOrFailure.question.yesButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'couldTalk',
                  success: true,
                });
              }
            },
            startIcon: LooksOne,
          },
          {
            label: messages.report.steps.successOrFailure.question.noButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'failureReason',
                  success: false,
                });
              }
            },
            startIcon: LooksTwo,
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default SuccessOrFailure;
