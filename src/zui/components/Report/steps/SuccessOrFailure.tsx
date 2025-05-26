import { Stack } from '@mui/material';
import { FC } from 'react';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  firstName: string;
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const SuccessOrFailure: FC<Props> = ({ firstName, onReportUpdate, report }) => {
  const messages = useMessages(messageIds);
  return (
    <Stack gap="0.5rem">
      <ZUIText variant="headingMd">
        <Msg
          id={messageIds.report.steps.successOrFailure.question.title}
          values={{ firstName }}
        />
      </ZUIText>
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
          },
        ]}
        fullWidth
        variant="secondary"
      />
    </Stack>
  );
};

export default SuccessOrFailure;
