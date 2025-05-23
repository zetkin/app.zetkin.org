import { FC } from 'react';
import { Stack } from '@mui/system';

import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import ZUIButtonGroup from 'zui/components/ZUIButtonGroup';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const OrganizerAction: FC<Props> = ({ onReportUpdate, report }) => {
  return (
    <Stack gap="1rem">
      <ZUIText>
        Did anything happen during the call that requires action by an official?
      </ZUIText>
      <ZUIButtonGroup
        buttons={[
          {
            label: 'Yes',
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: true,
                step: 'orgLog',
              }),
          },
          {
            label: 'No',
            onClick: () =>
              onReportUpdate({
                ...report,
                organizerActionNeeded: false,
                step: 'callerLog',
              }),
          },
        ]}
        variant="secondary"
      />
    </Stack>
  );
};

export default OrganizerAction;
