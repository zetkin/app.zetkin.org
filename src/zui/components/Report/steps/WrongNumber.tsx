import { FC } from 'react';
import { Box } from '@mui/material';

import { ReportType } from '..';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  phoneAndAltPhone: { altPhone: string; phone: string };
  report: ReportType;
};

const WrongNumber: FC<Props> = ({
  onReportUpdate,
  report,
  phoneAndAltPhone,
}) => {
  return (
    <Box alignItems="flex-start" display="flex" flexDirection="column">
      <ZUIText>Which number is wrong?</ZUIText>
      <ZUIButton
        label={phoneAndAltPhone.phone}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'phone',
          })
        }
        variant="secondary"
      />
      <ZUIButton
        label={phoneAndAltPhone.altPhone}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'altPhone',
          })
        }
        variant="secondary"
      />
      <ZUIButton
        label="Both"
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerActionNeeded: true,
            step: 'orgLog',
            wrongNumber: 'both',
          })
        }
        variant="secondary"
      />
    </Box>
  );
};

export default WrongNumber;
