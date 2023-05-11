import dayjs from 'dayjs';
import { FormattedDate } from 'react-intl';
import { MenuItem, Select } from '@mui/material';

import range from 'utils/range';

export interface YearSelectProps {
  focusDate: Date;
  onChange: (date: Date) => void;
}

const YearSelect = ({ focusDate, onChange }: YearSelectProps) => {
  const amountOfYears = 18;
  const startYear = focusDate.getFullYear() - 8;

  return (
    <Select
      disableUnderline
      onChange={(event) => {
        const newYear =
          typeof event.target.value === 'number'
            ? event.target.value
            : parseInt(event.target.value);
        const newDate = dayjs(focusDate).year(newYear);
        onChange(newDate.toDate());
      }}
      value={focusDate.getFullYear()}
      variant="standard"
    >
      {range(amountOfYears).map((index) => {
        const year = dayjs(focusDate).year(startYear + index);
        return (
          <MenuItem key={index} value={year.year()}>
            <FormattedDate value={year.toDate()} year="numeric" />
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default YearSelect;
