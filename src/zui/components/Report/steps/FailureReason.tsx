import { FC } from 'react';
import { Box, Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

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
  return (
    <Stack gap="1rem">
      <ZUIText>Why not?</ZUIText>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ZUIButton
          label="No pick up"
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
          label="Wrong number"
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
          label="Busy"
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
          label="Not available right now"
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
