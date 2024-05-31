import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useState } from 'react';

import { makeNaiveDateString } from 'utils/dateUtils';
import { ZetkinCustomField } from 'utils/types/zetkin';

interface CustomDateFieldProps {
  field: ZetkinCustomField;
  initialValue: Dayjs | null;
  onChange: (field: string, value: string) => void;
}

const CustomDateField: FC<CustomDateFieldProps> = ({
  field,
  initialValue,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue ?? null);

  return (
    <DatePicker
      format="DD-MM-YYYY"
      label={field.title}
      onChange={(date: Dayjs | null) => {
        if (date) {
          const dateStr = makeNaiveDateString(date.utc().toDate());
          setValue(dayjs(dateStr));
          onChange(field.slug, dateStr);
        }
      }}
      value={value}
    />
  );
};

export default CustomDateField;
