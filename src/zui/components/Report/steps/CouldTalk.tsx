import { FC } from 'react';
import { Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CouldTalk: FC<Props> = ({ onReportUpdate, report }) => {
  return (
    <Stack gap="1rem">
      <ZUIText>Couldd they talk?</ZUIText>
      <ZUIButtonGroup
        buttons={[
          {
            label: 'Yes',
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'orgAction',
                  targetCouldTalk: true,
                });
              }
            },
          },
          {
            label: 'No, call back',
            onClick: () => {
              if (onReportUpdate) {
                onReportUpdate({
                  ...report,
                  step: 'callBack',
                  targetCouldTalk: false,
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

export default CouldTalk;
