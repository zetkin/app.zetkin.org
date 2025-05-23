import { FC } from 'react';
import { Stack } from '@mui/material';

import { ReportType } from '..';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const LeftMessage: FC<Props> = ({ onReportUpdate, report }) => {
  return (
    <Stack gap="1rem">
      <ZUIText>Did you leave a message on the answering machine?</ZUIText>
      <ZUIButtonGroup
        buttons={[
          {
            label: 'Yes',
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: true,
                step: 'orgAction',
              }),
          },
          {
            label: 'No',
            onClick: () =>
              onReportUpdate({
                ...report,
                leftMessage: false,
                step: 'orgAction',
              }),
          },
        ]}
        variant="secondary"
      />
    </Stack>
  );
};

export default LeftMessage;
