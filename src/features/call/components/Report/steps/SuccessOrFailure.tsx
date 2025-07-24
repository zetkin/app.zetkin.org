import { FC, useEffect } from 'react';
import { LooksOneOutlined, LooksTwoOutlined } from '@mui/icons-material';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/call/l10n/messageIds';
import StepBase from './StepBase';
import useIsMobile from 'utils/hooks/useIsMobile';
import { Report } from 'features/call/types';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: Report) => void;
  report: Report;
};

const SuccessOrFailure: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const isMobile = useIsMobile();
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
            endIcon: !isMobile ? LooksOneOutlined : undefined,
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
          },
          {
            endIcon: !isMobile ? LooksTwoOutlined : undefined,
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
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </StepBase>
  );
};

export default SuccessOrFailure;
