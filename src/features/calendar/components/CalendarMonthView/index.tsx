import { Box, fontSize } from "@mui/system";
import useModel from "core/useModel";
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import CampaignActivitiesModel, { ACTIVITIES, CampaignActivity } from "features/campaigns/models/CampaignActivitiesModel";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useEffect, useState } from "react";
import ZUIFuture from "zui/ZUIFuture";
import CalendarMonthViewDay from "./CalendarMonthViewDay";

type CalendarWeekNumberProps = {
  weekNr: number

}

const CalendarWeekNumber = ({weekNr}: CalendarWeekNumberProps) => {
  return <>
    <Box
      fontSize="0.75rem"
      padding="7px"
      color="#9f9f9f"
      width="100%"
      height="100%"
    >{weekNr}</Box>
  </>
}




type Props = {
  focusDate: Date,
  onChangeFocusDate: (date: Date) => void
}
const CalendarMonthView = ({ focusDate, onChangeFocusDate }: Props) => {
  const { orgId } = useRouter().query;
  const model = useModel(
    (env) => new CampaignActivitiesModel(env, parseInt(orgId as string))
  );

  const [weekNumber, setWeekNumber] = useState(0);
  const numberOfRows = 6;
  const numberOfColumns = 7;

  const firstDayOfMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  function getDaysBeforeFirstDay() {
    const daysBeforeFirstDay = firstDayOfMonth.getDay();
    if (daysBeforeFirstDay === 0) {
      return 6;
    } else {
      return daysBeforeFirstDay - 1;
    }
  }

  const daysBeforeFirstDay = getDaysBeforeFirstDay();
  const firstDayOfCalendar = dayjs(firstDayOfMonth).subtract(daysBeforeFirstDay, "day");
  const currentDate = new Date();
  
  useEffect(() => {
    dayjs.extend(isoWeek)
  }, []);

  useEffect(() => {
    setWeekNumber(firstDayOfCalendar.isoWeek());
  }, [firstDayOfCalendar]);

  function getDayIndex(rowIndex: number, columnIndex: number) {
    return (columnIndex) + (rowIndex * (numberOfColumns) )
  }

  function isBetween(testDate: Date | Dayjs, first: Date | Dayjs, last: Date | Dayjs) : boolean {
    const date = dayjs(testDate);
    return date.isAfter(first) && date.isBefore(last);
  }

  return <>
    <ZUIFuture future={model.getAllActivities()}>
      {(data) => {
        const events = data.filter(a => a.kind == ACTIVITIES.EVENT);
        const eventsOfMonth = events
          .filter(a => a.endDate != null)
          .filter(a => 
            isBetween(a.endDate!, firstDayOfCalendar, firstDayOfCalendar.add(6, "weeks"))
          );
        //console.log("events", events);
        console.log("eventsOfMonth", eventsOfMonth);
        return (
          <Box
            display="grid"
            gridTemplateColumns={`auto repeat(${numberOfColumns}, 1fr)`}
            gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
            gap="8px"
            flexGrow="1"
            bgcolor="#f5f5f5"
            margin="12px"
          >
            {[...Array(numberOfRows)]
              .map((_, rowIndex) => [...Array(numberOfColumns + 1)]
                .map((_, columnIndex) =>
                  <>
                    {columnIndex === 0 && <CalendarWeekNumber weekNr={weekNumber + rowIndex} />}
                    {columnIndex !== 0 && <CalendarMonthViewDay
                      firstDateOfCalendar={firstDayOfCalendar}
                      eventsOfMonth={eventsOfMonth}
                      focusDate={focusDate}
                      onChangeFocusDate={onChangeFocusDate}
                      currentDate={currentDate}
                      dayIndex={getDayIndex(rowIndex, columnIndex - 1)}
                    />}
                  </>
                )
              )}
          </Box>
        );
      }}
    </ZUIFuture>
  </>
};

export default CalendarMonthView;
