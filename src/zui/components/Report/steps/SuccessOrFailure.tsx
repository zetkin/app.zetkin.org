import { Stack } from '@mui/material';
import { FC } from 'react';

import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const SuccessOrFailure: FC<Props> = ({ onReportUpdate, report }) => {
  return (
    <Stack gap="1rem">
      <ZUIText>Did you reach them?</ZUIText>
      <ZUIButtonGroup
        buttons={[
          {
            label: 'Yes',
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
            label: 'No',
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
        variant="secondary"
      />
    </Stack>
  );
};

export default SuccessOrFailure;
