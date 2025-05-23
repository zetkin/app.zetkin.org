import { FC, useState } from 'react';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useIntl } from 'react-intl';

import { ReportType } from '..';
import ZUIAutocomplete from 'zui/components/ZUIAutocomplete';
import ZUIDateField from 'zui/components/ZUIDateField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

type Props = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
};

const CallBack: FC<Props> = ({ onReportUpdate, report }) => {
  const intl = useIntl();
  const today = dayjs();
  const tomorrow = today.add(1, 'day');
  const initialDate = dayjs(report.callBackAfter || tomorrow);
  const [date, setDate] = useState<Dayjs>(initialDate);
  const [time, setTime] = useState<{ label: string; value: string }>({
    label: 'Any time',
    value: 'any',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ZUIText>When should we call back?</ZUIText>
      <ZUIDateField
        disablePast
        label="On what date"
        onChange={(newDate) => {
          if (newDate) {
            setDate(newDate);
          }
        }}
        value={dayjs(date)}
      />
      <ZUIAutocomplete
        label="After what time"
        multiple={false}
        onChange={(newValue) => {
          if (newValue) {
            setTime(newValue);
          }
        }}
        options={[
          { label: 'Any time', value: 'any' },
          { label: 'After 10.00', value: '10.00' },
        ]}
        value={time}
      />
      <ZUIButton
        label={`Call back on ${intl.formatDate(date?.toDate())} ${
          time ? time.value : 'at any time of the day'
        }`}
        onClick={() => {
          const callBackTime = time.value == 'any' ? '00.00' : time.value;
          const month = (date.month() + 1).toString().padStart(2, '0');

          const callBackAfter = `${date.year()}-${month}-${date.date()}T${callBackTime}`;

          onReportUpdate({
            ...report,
            callBackAfter,
            step: 'orgAction',
          });
        }}
        variant="secondary"
      />
    </Box>
  );
};

export default CallBack;
