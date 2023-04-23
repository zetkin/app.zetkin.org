import { Box } from "@mui/system";
import theme from 'theme';
import dayjs, { Dayjs } from "dayjs";

type CalendarMonthViewDayProps = {
  focusDate: Date,
  currentDate: Date,
  firstDateOfCalendar: Dayjs,
  dayIndex: number,
  onChangeFocusDate: (date: Date) => void
}
const CalendarMonthViewDay = ({focusDate, currentDate, firstDateOfCalendar, dayIndex} : CalendarMonthViewDayProps) => {
  const date = firstDateOfCalendar.add(dayIndex, "day");
  const isSameMonth = date.month() === focusDate.getMonth();
  const isSameAsCurrentDate = dayjs(date).isSame(currentDate, "day");
  let textColor = theme.palette.text.secondary;
  if (isSameAsCurrentDate) {
    textColor = theme.palette.primary.main;
  } else if (!isSameMonth) {
    textColor = "#dfdfdf";
  }

  return <>
    <button
      style={{
        background: "none",
        border: "none",
        outline: "none",
        padding: "0",
        fontSize: "0.75rem"
      }}>
      <Box
        bgcolor={isSameMonth ? "#eee" : "none"}
        border="2px solid #eeeeee"
        borderColor={isSameAsCurrentDate ? theme.palette.primary.main : "eee"}
        color={textColor}
        alignItems="start"
        padding="6px"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
      >
        {date.toDate().toLocaleDateString("sv", { day: "numeric" })}
      </Box>
    </button>
  </>
}

export default CalendarMonthViewDay;