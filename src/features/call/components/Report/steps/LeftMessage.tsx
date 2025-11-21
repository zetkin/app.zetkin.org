import { FC, useEffect } from 'react';
import { LooksOneOutlined, LooksTwoOutlined } from '@mui/icons-material';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Report } from 'features/call/types';

type Props = {
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  const isMobile = useIsMobile();
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
            endIcon: !isMobile ? LooksOneOutlined : undefined,
            label: messages.report.steps.leftMessage.question.yesButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'organizerAction',
              }),
          },
          {
            endIcon: !isMobile ? LooksTwoOutlined : undefined,
            label: messages.report.steps.leftMessage.question.noButton(),
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'organizerAction',
              }),
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default LeftMessage;
