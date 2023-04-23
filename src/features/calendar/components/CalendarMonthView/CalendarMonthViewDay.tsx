import { Box } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";
import { CampaignActivity } from "features/campaigns/models/CampaignActivitiesModel";

type CalendarMonthViewDayProps = {
  eventsOfMonth: CampaignActivity[],
  focusDate: Date,
  currentDate: Date,
  firstDateOfCalendar: Dayjs,
  dayIndex: number,
  onChangeFocusDate: (date: Date) => void
}
const CalendarMonthViewDay = ({focusDate, currentDate, firstDateOfCalendar, dayIndex, eventsOfMonth} : CalendarMonthViewDayProps) => {
  const date = firstDateOfCalendar.add(dayIndex, "day");
  const eventsOfDay = eventsOfMonth.filter(event => dayjs(event.endDate).isSame(date, "days"));
  const isSameMonth = date.month() === focusDate.getMonth();
  const isSameAsCurrentDate = dayjs(date).isSame(currentDate, "day");
  let textColor = "#9f9f9f";
  if (isSameAsCurrentDate) {
    textColor = "#6ba5df";
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
        borderColor={isSameAsCurrentDate ? "#6ba5df" : "#eee"}
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