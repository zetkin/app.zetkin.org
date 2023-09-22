import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';

const styles = {
  fontSize: 'typography.h4.fontSize',
  padding: 0,
  width: '12rem',
};

const StyledDatePicker: React.FC<DatePickerProps<Date>> = (
  props
): React.ReactElement => {
  return <DatePicker {...props} slotProps={{ textField: { sx: styles } }} />;
};

export default StyledDatePicker;
