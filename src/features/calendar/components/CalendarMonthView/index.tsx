import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import useResizeObserver from 'zui/hooks/useResizeObserver';
import range from 'utils/range';
import { useFocusDate } from 'utils/hooks/useFocusDate';
import useMonthCalendarEvents from 'features/calendar/hooks/useMonthCalendarEvents';
import { useMonthDates } from 'features/calendar/hooks/useMonthDates';
import { useAppDispatch, useNumericRouteParams } from 'core/hooks';
import { setMaxMonthEventsPerDay } from 'features/calendar/store';
import { getWeekNumber } from './utils';
import WeekNumber from './WeekNumber';
import Day from './Day';

const gridGap = 8;
const numberOfRows = 6;
const numberOfDayColumns = 7;
const numberOfGridColumns = 8;

type CalendarMonthViewProps = {
  onClickDay: (date: Date) => void;
  onClickWeek: (date: Date) => void;
};

const CalendarMonthView = ({
  onClickDay,
  onClickWeek,
}: CalendarMonthViewProps) => {
  const itemHeight = 25;
  const { gridRef, maxPerDay } = useFlexibleMaxPerDay(itemHeight);
  const dispatch = useAppDispatch();

  const { focusDate } = useFocusDate();
  const { firstDayOfCalendar } = useMonthDates();

  useEffect(() => {
    dispatch(setMaxMonthEventsPerDay(maxPerDay));
  }, [maxPerDay]);

  function onClickWeekHandler(rowIndex: number) {
    onClickWeek(dayjs(firstDayOfCalendar).add(rowIndex, 'week').toDate());
  }

  const { orgId, campId } = useNumericRouteParams();
  const clustersByDate = useMonthCalendarEvents({
    campaignId: campId,
    maxPerDay,
    orgId,
  });

  return (
    <Box
      ref={gridRef}
      display="grid"
      flexGrow="0"
      gap={`${gridGap}px`}
      gridTemplateColumns={`auto repeat(${numberOfDayColumns}, 1fr)`}
      gridTemplateRows={`repeat(${numberOfRows}, 1fr)`}
      height="100%"
    >
      {
        // Creates 6 rows
        range(numberOfRows).map((rowIndex) =>
          // Creates 8 items in each row
          range(numberOfGridColumns).map((columnIndex) => {
            const gridItemKey = columnIndex + rowIndex * numberOfGridColumns;

            // First item in each row is the week number
            if (columnIndex === 0) {
              return (
                <WeekNumber
                  key={gridItemKey}
                  onClick={() => onClickWeekHandler(rowIndex)}
                  weekNr={getWeekNumber(firstDayOfCalendar, rowIndex)}
                />
              );
            }

            // Remaining items in each row are days
            const dayIndex = columnIndex - 1 + rowIndex * numberOfDayColumns; // Index of the day within the day grid
            const date = dayjs(firstDayOfCalendar)
              .add(dayIndex, 'day')
              .toDate();

            const clusters = clustersByDate[dayIndex].clusters;

            const isInFocusMonth = date.getMonth() === focusDate.getMonth();

            return (
              <Day
                key={gridItemKey}
                clusters={clusters}
                date={date}
                isInFocusMonth={isInFocusMonth}
                itemHeight={itemHeight}
                onClick={onClickDay}
              />
            );
          })
        )
      }
    </Box>
  );
};

export default CalendarMonthView;

/**
 * Calculate the maximum number of event clusters that can be displayed
 * in a day without overflowing the grid.
 */
function useFlexibleMaxPerDay(itemHeight: number) {
  const [maxPerDay, setMaxPerDay] = useState(3);

  const gridRef = useResizeObserver((elem) => {
    const rect = elem.getBoundingClientRect();
    const heightWithoutGaps = rect.height - gridGap * 5;
    const dayHeight = heightWithoutGaps / 6;
    const newMaxPerDay = Math.floor(dayHeight / itemHeight) - 1;
    setMaxPerDay(newMaxPerDay);
  });

  return { gridRef, maxPerDay };
}
