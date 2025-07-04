import { FC, useEffect } from 'react';
import { LooksOneOutlined, LooksTwoOutlined } from '@mui/icons-material';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import messageIds from 'features/call/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Report } from 'features/call/types';

type Props = {
  disableCallerNotes: boolean;
  onReportFinished?: () => void;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const OrganizerAction: FC<Props> = ({
  disableCallerNotes,
  onReportFinished,
  onReportUpdate,
  report,
}) => {
  const isMobile = useIsMobile();
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
            endIcon: !isMobile ? LooksOneOutlined : undefined,
            label: messages.report.steps.organizerAction.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: true,
                step: 'organizerLog',
              }),
          },
          {
            endIcon: !isMobile ? LooksTwoOutlined : undefined,
            label: messages.report.steps.organizerAction.question.noButton(),
            onClick: () => {
              onReportUpdate({
                ...report,
                completed: disableCallerNotes ? true : false,
                organizerActionNeeded: false,
                step: 'callerLog',
              });
              if (onReportFinished) {
                onReportFinished();
              }
            },
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default OrganizerAction;
