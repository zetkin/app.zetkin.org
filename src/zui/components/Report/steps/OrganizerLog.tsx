import { FC, useState } from 'react';
import { Stack } from '@mui/system';

import { ReportType } from '..';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const OrganizerLog: FC<Props> = ({ onReportUpdate, report }) => {
  const [message, setMessage] = useState(
    report.wrongNumber ? 'Wrong number, please investigate' : ''
  );

  return (
    <Stack gap="1rem">
      <ZUIText>Explain the problem to the official</ZUIText>
      <ZUITextField
        multiline
        onChange={(newMessage) => setMessage(newMessage)}
        value={message}
      />
      <ZUIButton
        label={message ? 'Include message' : 'Save without message'}
        onClick={() =>
          onReportUpdate({
            ...report,
            organizerLog: message,
            step: 'callerLog',
          })
        }
        variant="secondary"
      />
    </Stack>
  );
};

export default OrganizerLog;
