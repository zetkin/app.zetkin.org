import { MenuItem, Select } from '@mui/material';

import range from 'utils/range';

export interface YearSelectProps {
  focusDate: Temporal.PlainDate;
  onChange: (date: Temporal.PlainDate) => void;
}

const YearSelect = ({ focusDate, onChange }: YearSelectProps) => {
  const amountOfYears = 18;
  const startYear = focusDate.year - 8;

  return (
    <Select
      disableUnderline
      onChange={(event) => {
        onChange(Temporal.PlainDate.from(event.target.value.toString()));
      }}
      value={focusDate.toString()}
      variant="standard"
    >
      {range(amountOfYears).map((index) => {
        const year = focusDate.with({ year: startYear + index });
        return (
          <MenuItem key={index} value={year.toString()}>
            {year.year}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default YearSelect;
