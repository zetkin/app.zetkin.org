import { FC, useEffect } from 'react';
import { LooksOne, LooksTwo } from '@mui/icons-material';

import { Report } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const CouldTalk: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            step: 'organizerAction',
            targetCouldTalk: true,
          });
        }
      } else if (ev.key == '2') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            step: 'callBack',
            targetCouldTalk: false,
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
          id={messageIds.report.steps.couldTalk.question.title}
          values={{ firstName }}
        />
      }
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.couldTalk.question.yesButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'organizerAction',
                  targetCouldTalk: true,
                });
              }
            },
            startIcon: LooksOne,
          },
          {
            label: messages.report.steps.couldTalk.question.noButton(),
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'callBack',
                  targetCouldTalk: false,
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

export default CouldTalk;
