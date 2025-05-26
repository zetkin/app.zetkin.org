import { FC } from 'react';
import { Box, Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

type Props = {
  nextStepIfWrongNumber: 'wrongNumber' | 'orgLog';
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const FailureReason: FC<Props> = ({
  nextStepIfWrongNumber,
  onReportUpdate,
  report,
}) => {
  const messages = useMessages(messageIds);
  return (
    <Stack gap="1rem">
      <ZUIText>
        <Msg id={messageIds.report.steps.failureReason.question.title} />
      </ZUIText>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          variant="secondary"
        />
        <ZUIButton
          label={messages.report.steps.failureReason.question.lineBusy()}
          onClick={() => {
            if (onReportUpdate) {
              onReportUpdate({
                ...report,
                failureReason: 'lineBusy',
                step: 'orgAction',
              });
            }
          }}
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
          variant="secondary"
        />
      </Box>
    </Stack>
  );
};

export default FailureReason;
