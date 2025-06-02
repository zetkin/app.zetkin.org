import { FC, useEffect } from 'react';
import { LooksOne, LooksTwo } from '@mui/icons-material';

import { Report } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  const messages = useMessages(messageIds);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key == '1') {
        onReportUpdate({
          ...report,
          leftMessage: true,
          step: 'organizerAction',
        });
      } else if (ev.key == '2') {
        onReportUpdate({
          ...report,
          leftMessage: false,
          step: 'organizerAction',
        });
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
      title={<Msg id={messageIds.report.steps.leftMessage.question.title} />}
    >
      <ZUIButtonGroup
        buttons={[
          {
            label: messages.report.steps.leftMessage.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'organizerAction',
              }),
            startIcon: LooksOne,
          },
          {
            label: messages.report.steps.leftMessage.question.noButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'organizerAction',
              }),
            startIcon: LooksTwo,
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default LeftMessage;
