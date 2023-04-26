import dayjs from 'dayjs';
import theme from 'theme';
import { Box, ButtonBase, Typography } from '@mui/material';

type CalendarMonthViewDayProps = {
  currentDate: Date;
  dayIndex: number;
  firstDateOfCalendar: Date;
  focusDate: Date;
};
const CalendarMonthViewDay = ({
  focusDate,
  currentDate,
  firstDateOfCalendar,
  dayIndex,
}: CalendarMonthViewDayProps) => {
  const date = dayjs(firstDateOfCalendar).add(dayIndex, 'day');
  const isSameMonth = date.month() === focusDate.getMonth();
  const isToday = date.isSame(currentDate, 'day');

  let textColor = theme.palette.text.secondary;
  if (isToday) {
    textColor = theme.palette.primary.main;
  } else if (!isSameMonth) {
    textColor = '#dfdfdf';
  }

  return (
    <>
      <ButtonBase
        sx={{
          background: 'none',
          border: 'none',
          outline: 'none',
          padding: '0',
        }}
      >
        <Box
          alignItems="start"
          bgcolor={isSameMonth ? '#eee' : 'none'}
          border="2px solid #eeeeee"
          borderColor={isToday ? theme.palette.primary.main : 'eee'}
          display="flex"
          flexDirection="column"
          height="100%"
          width="100%"
        >
          <Box marginLeft="5px">
            <Typography color={textColor} fontSize=".8rem">
              {date.toDate().toLocaleDateString('sv', { day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </ButtonBase>
    </>
  );
};

export default CalendarMonthViewDay;
