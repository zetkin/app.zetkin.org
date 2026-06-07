import dayjs from 'dayjs';
import { useFormatter } from 'next-intl';
import { MenuItem, Select } from '@mui/material';

import range from 'utils/range';

export interface MonthSelectProps {
  focusDate: Date;
  onChange: (date: Date) => void;
}

const MonthSelect = ({ focusDate, onChange }: MonthSelectProps) => {
  const format = useFormatter();
  return (
    <Select
      disableUnderline
      onChange={(event) => {
        const selectedMonth =
          typeof event.target.value === 'number'
            ? event.target.value
            : parseInt(event.target.value);
        const newFocusDate = dayjs(focusDate).month(selectedMonth).toDate();
        onChange(newFocusDate);
      }}
      value={focusDate.getMonth()}
      variant="standard"
    >
      {range(12).map((index) => {
        const month = dayjs().day(0).month(index).toDate();
        return (
          <MenuItem key={index} value={index}>
            {format.dateTime(month, { month: 'long' })}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default MonthSelect;
