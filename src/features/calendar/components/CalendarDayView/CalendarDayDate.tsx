import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { isSameDate } from 'utils/dateUtils';

export interface CalendarDayDateProps {
  date: Date;
  focusDate: Date;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CalendarDayDate = ({ date, focusDate }: CalendarDayDateProps) => {
  return (
    <Box
      color={isSameDate(focusDate, date) ? 'white' : 'black'}
      display="inline-block"
      padding={1}
      sx={{
        backgroundColor: isSameDate(focusDate, date) ? 'blue' : 'inherited',
        borderRadius: '16px',
      }}
    >
      {dayjs(date).get('D')} {months[dayjs(date).get('month')]},{' '}
      {dayjs(date).format('dddd')}
    </Box>
  );
};

export default CalendarDayDate;
