import { Box } from '@mui/system';
import theme from 'theme';
import dayjs, { Dayjs } from 'dayjs';

type CalendarMonthViewDayProps = {
  currentDate: Date;
  dayIndex: number;
  firstDateOfCalendar: Dayjs;
  focusDate: Date;
};
const CalendarMonthViewDay = ({
  focusDate,
  currentDate,
  firstDateOfCalendar,
  dayIndex,
}: CalendarMonthViewDayProps) => {
  const date = firstDateOfCalendar.add(dayIndex, 'day');
  const isSameMonth = date.month() === focusDate.getMonth();
  const isSameAsCurrentDate = dayjs(date).isSame(currentDate, 'day');
  let textColor = theme.palette.text.secondary;
  if (isSameAsCurrentDate) {
    textColor = theme.palette.primary.main;
  } else if (!isSameMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <>
      <button
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.75rem',
          outline: 'none',
          padding: '0',
        }}
      >
        <Box
          alignItems="start"
          bgcolor={isSameMonth ? '#eee' : 'none'}
          border="2px solid #eeeeee"
          borderColor={isSameAsCurrentDate ? theme.palette.primary.main : 'eee'}
          color={textColor}
          display="flex"
          flexDirection="column"
          height="100%"
          padding="6px"
          width="100%"
        >
          {date.toDate().toLocaleDateString('sv', { day: 'numeric' })}
        </Box>
      </button>
    </>
  );
};

export default CalendarMonthViewDay;

