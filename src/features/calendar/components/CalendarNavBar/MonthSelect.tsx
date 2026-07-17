import { MenuItem, Select } from '@mui/material';

import range from 'utils/range';

export interface MonthSelectProps {
  focusDate: Temporal.PlainDate;
  onChange: (date: Temporal.PlainDate) => void;
}

const MonthSelect = ({ focusDate, onChange }: MonthSelectProps) => {
  return (
    <Select
      disableUnderline
      onChange={(event) => {
        onChange(Temporal.PlainDate.from(event.target.value.toString()));
      }}
      value={focusDate.toString()}
      variant="standard"
    >
      {range(12).map((index) => {
        const month = focusDate.with({ month: index + 1 });
        return (
          <MenuItem key={index} value={month.toString()}>
            {month.toLocaleString(undefined, { month: 'long' })}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default MonthSelect;
