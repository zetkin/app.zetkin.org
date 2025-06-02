import { FC, useEffect } from 'react';
import { LooksOne, LooksTwo } from '@mui/icons-material';

import { Report } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import messageIds from 'features/call/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import StepBase from './StepBase';

type Props = {
  onReportFinished?: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const OrganizerAction: FC<Props> = ({
  onReportFinished,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        onReportUpdate({
          ...report,
          organizerActionNeeded: true,
          step: 'organizerLog',
        });
      } else if (ev.key == '2') {
        if (onReportUpdate) {
          onReportUpdate({
            ...report,
            organizerActionNeeded: false,
            step: 'callerLog',
          });

          if (onReportFinished) {
            onReportFinished();
          }
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
        <Msg id={messageIds.report.steps.organizerAction.question.title} />
      }
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.organizerAction.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: true,
                step: 'organizerLog',
              }),
            startIcon: LooksOne,
          },
          {
            label: messages.report.steps.organizerAction.question.noButton(),
            onClick: () => {
              onReportUpdate({
                ...report,
                organizerActionNeeded: false,
                step: 'callerLog',
              });
              if (onReportFinished) {
                onReportFinished();
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

export default OrganizerAction;
