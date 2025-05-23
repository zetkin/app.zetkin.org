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

const CallerLog: FC<Props> = ({ onReportUpdate, report }) => {
  const [message, setMessage] = useState('');

  return (
    <Stack gap="1rem">
      <ZUIText>Do you wish to leave a note for future callers?</ZUIText>
      <ZUITextField
        multiline
        onChange={(newMessage) => setMessage(newMessage)}
        value={message}
      />
      <ZUIButton
        label={message ? 'Save note' : 'Save without note'}
        onClick={() =>
          onReportUpdate({ ...report, callerLog: message, step: 'summary' })
        }
        variant="secondary"
      />
    </Stack>
  );
};

export default CallerLog;
