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

  const options: { label: string; value: string }[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';

    options.push({
      label: i == 0 ? 'Any time of day' : hour,
      value: i == 0 ? 'any' : hour,
    });
  }
  const initialTime =
    options.find((o) => o.value == report.callBackAfter?.slice(-5)) ||
    options[0];

  const [time, setTime] =
    useState<{ label: string; value: string }>(initialTime);
  const [date, setDate] = useState<Dayjs>(initialDate);

  const getNextMonday = () => {
    const indexOfToday = today.day();
    return today.add(indexOfToday == 0 ? 1 : 8 - indexOfToday, 'day');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ZUIText>When should we call back?</ZUIText>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <ZUIDateField
          disablePast
          fullWidth
          label="On what date"
          onChange={(newDate) => {
            if (newDate) {
              setDate(newDate);
            }
          }}
          value={dayjs(date)}
        />
        <ZUIAutocomplete
          fullWidth
          label="After what time"
          multiple={false}
          onChange={(newValue) => {
            if (newValue) {
              setTime(newValue);
            }
          }}
          options={options}
          value={time}
        />
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <ZUIText variant="bodySmRegular">Examples:</ZUIText>
        <ZUIButton
          label="Later today"
          onClick={() => {
            setDate(today);
            const currentHour = today.hour();

            let callBackHour: number = currentHour + 3;
            if (currentHour == 23) {
              //If it's after 23.00 and you press this button,
              //we set the call back time to "any time tomorrow"
              setTime(options[0]);
              setDate(today.add(1, 'day'));
            } else {
              let hourString: string =
                callBackHour.toString().padStart(2, '0') + ':00';
              if (currentHour >= 21) {
                //If it's after 21.00 we add 1 hour to the call back time
                //instead of 3.
                callBackHour = currentHour + 1;
                hourString = callBackHour.toString().padStart(2, '0') + ':00';
              }
              setTime({ label: `After ${hourString}`, value: hourString });
            }
          }}
          size="small"
        />
        <ZUIButton
          label="Tomorrow"
          onClick={() => {
            setDate(today.add(1, 'day'));
            setTime(options[0]);
          }}
          size="small"
        />
        <ZUIButton
          label="Next week"
          onClick={() => {
            setDate(getNextMonday());
            setTime(options[0]);
          }}
          size="small"
        />
      </Box>
      <ZUIButton
        label={`Call back on ${intl.formatDate(date?.toDate())} after ${
          time.value
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
