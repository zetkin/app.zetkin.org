import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { isSameDate } from 'utils/dateUtils';
import theme from 'theme';

export interface CalendarDayDateProps {
  date: Date;
  focusDate: Date;
}

const CalendarDayDate = ({ date, focusDate }: CalendarDayDateProps) => {
  return (
    <Box
      color={isSameDate(focusDate, date) ? 'white' : 'black'}
      display="inline-block"
      padding={1}
      sx={{
        backgroundColor: isSameDate(focusDate, date)
          ? theme.palette.primary.main
          : 'inherited',
        borderRadius: '2em',
      }}
    >
      {dayjs(date).format('D')} {dayjs(date).format('MMMM')},{' '}
      {dayjs(date).format('dddd')}
    </Box>
  );
};

export default CalendarDayDate;
