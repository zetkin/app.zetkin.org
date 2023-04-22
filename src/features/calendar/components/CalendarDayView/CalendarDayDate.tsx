import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { isSameDate } from 'utils/dateUtils';


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
    color={isSameDate(focusDate, date) ? "white" : "black"}
    sx={{
      borderRadius: "16px",
      backgroundColor: isSameDate(focusDate, date) ? "blue" : "inherited",
    }}
  >
    {dayjs(date).get('D')} {months[dayjs(date).get('month')]}, {dayjs(date).format('dddd')}
  </Box>
};

export default CalendarDayDate;