import { Box, fontSize } from "@mui/system";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { KeyboardEventHandler, useEffect, useState } from "react";

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


type CalendarMonthViewBoxProps = {
  date: Date,
  focusDate: Date,
  currentDate: Date,
  onChangeFocusDate: (date: Date) => void
}
const CalendarMonthViewBox = ({date, focusDate, currentDate} : CalendarMonthViewBoxProps) => {
  const isSameMonth = date.getMonth() === focusDate.getMonth();
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
        {date.toLocaleDateString("sv", { day: "numeric" })}
      </Box>
    </button>
  </>
}




type Props = {
  focusDate: Date,
  onChangeFocusDate: (date: Date) => void
}
const CalendarMonthView = ({ focusDate, onChangeFocusDate }: Props) => {
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
  console.log("daysBeforeFirstDay", daysBeforeFirstDay);
  const firstDayOfCalender = dayjs(firstDayOfMonth).subtract(daysBeforeFirstDay, "day");
  const currentDate = new Date();
  
  useEffect(() => {
    dayjs.extend(isoWeek)
    setWeekNumber(firstDayOfCalender.isoWeek());
  }, [firstDayOfCalender]);

  function getDayIndex(rowIndex: number, columnIndex: number) {
    return (columnIndex) + (rowIndex * (numberOfColumns) )
  }

  return <>
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
              {columnIndex !== 0 && <CalendarMonthViewBox
                focusDate={focusDate}
                onChangeFocusDate={onChangeFocusDate}
                currentDate={currentDate}
                date={dayjs(firstDayOfCalender).add(getDayIndex(rowIndex, columnIndex - 1), "day").toDate()}
              />}
            </>
          )
        )}
    </Box>
  </>
};

export default CalendarMonthView;
