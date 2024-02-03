import dayjs from 'dayjs';
import { useTheme } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';

const StyledDatePicker: React.FC<DatePickerProps<dayjs.Dayjs>> = (
  props
): React.ReactElement => {
  const theme = useTheme();
  return (
    <DatePicker
      {...props}
      slotProps={{
        textField: {
          inputProps: {
            sx: {
              fontSize: theme.typography.h4.fontSize,
              padding: 0,
            },
          },
          sx: {
            paddingRight: 1,
            paddingTop: '1px',
            width: '15rem',
          },
          variant: 'standard',
        },
      }}
    />
  );
};

export default StyledDatePicker;
