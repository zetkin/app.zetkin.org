import Box from '@mui/material/Box';
import dayjs from 'dayjs';

export interface CalendarDayDateProps {
  focusDate: Date;
  date: Date;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const CalendarDayDate = ({
  focusDate,
  date
}: CalendarDayDateProps) => {
  return <Box
    display="inline-block"
    padding={1}
    color={dayjs(focusDate).format('YYYY-MM-DD') == dayjs(date).format('YYYY-MM-DD') ? "white" : "black"}
    sx={{
      borderRadius: "16px",
      backgroundColor: dayjs(focusDate).format('YYYY-MM-DD') == dayjs(date).format('YYYY-MM-DD') ? "blue" : "inherited",
    }}
  >
    {dayjs(focusDate).get('D')} {months[dayjs(focusDate).get('month')]}, {dayjs(focusDate).format('dddd')}
  </Box>
};

export default CalendarDayDate;