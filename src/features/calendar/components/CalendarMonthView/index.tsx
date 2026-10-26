import { Box } from '@mui/material';
import React, { useEffect, useId, useState } from 'react';

import Day from './Day';
import EventCreateMenu from '../EventCreateMenu';
import EventShiftModal from '../EventShiftModal';
import range from 'utils/range';
import useMonthCalendarEvents from 'features/calendar/hooks/useMonthCalendarEvents';
import { useNumericRouteParams } from 'core/hooks';
import useResizeObserver from 'zui/hooks/useResizeObserver';
import WeekNumber from './WeekNumber';
import { legacyDateFromPlainDate } from 'utils/dateUtils';
import useCreateEmptyEvent from 'features/events/hooks/useCreateEmptyEvent';

const gridGap = 8;
const numberOfRows = 6;
const numberOfDayColumns = 7;
const numberOfGridColumns = 8;

type CalendarMonthViewProps = {
  focusDate: Temporal.PlainDate;
  onClickDay: (date: Date) => void;
  onClickWeek: (date: Date) => void;
};

const CalendarMonthView = ({
  focusDate,
  onClickDay,
  onClickWeek,
}: CalendarMonthViewProps) => {
  const itemHeight = 25;
  const { gridRef, maxPerDay } = useFlexibleMaxPerDay(itemHeight);
  const menuId = useId();
  const [selectedDay, setSelectedDay] = useState<{
    anchorEl: HTMLButtonElement;
    date: Temporal.PlainDate;
  } | null>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const focusMonth = focusDate.toPlainYearMonth().toString();

  useEffect(() => {
    setSelectedDay(null);
    setShiftModalOpen(false);
  }, [focusMonth]);

  const firstDayOfMonth = focusDate.with({ day: 1 });
  const firstDayOfCalendar = firstDayOfMonth.subtract({
    days: firstDayOfMonth.dayOfWeek - 1,
  });

  function onClickWeekHandler(rowIndex: number) {
    onClickWeek(
      legacyDateFromPlainDate(firstDayOfCalendar.add({ weeks: rowIndex }))
    );
  }
  const lastDayOfCalendar = firstDayOfCalendar.add({ weeks: 6 });

  const { orgId, projectId } = useNumericRouteParams();
  const { createEmptyEvent, creating } = useCreateEmptyEvent(orgId);
  const defaultStart = selectedDay?.date.toPlainDateTime({ hour: 9 });
  const defaultEnd = defaultStart?.add({ hours: 1 });

  async function onCreateSingle() {
    if (!defaultStart || !defaultEnd) {
      return;
    }

    const event = await createEmptyEvent({
      campaign_id: projectId,
      end_time: defaultEnd.toString(),
      start_time: defaultStart.toString(),
    });
    if (event) {
      setSelectedDay((current) => (current === selectedDay ? null : current));
    }
  }
  const clustersByDate = useMonthCalendarEvents({
    endDate: legacyDateFromPlainDate(lastDayOfCalendar),
    maxPerDay,
    orgId,
    projectId,
    startDate: legacyDateFromPlainDate(firstDayOfCalendar),
  });

  return (
    <>
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
                    weekNr={
                      firstDayOfCalendar.add({ weeks: rowIndex }).weekOfYear!
                    }
                  />
                );
              }

              // Remaining items in each row are days
              const dayIndex = columnIndex - 1 + rowIndex * numberOfDayColumns; // Index of the day within the day grid
              const date = firstDayOfCalendar.add({ days: dayIndex });

              const clusters = clustersByDate[dayIndex].clusters;

              const isInFocusMonth = date
                .toPlainYearMonth()
                .equals(focusDate.toPlainYearMonth());

              return (
                <Day
                  key={gridItemKey}
                  clusters={clusters}
                  date={date}
                  disabled={creating}
                  isInFocusMonth={isInFocusMonth}
                  itemHeight={itemHeight}
                  menuId={
                    selectedDay?.date.equals(date) && !shiftModalOpen
                      ? menuId
                      : undefined
                  }
                  onClick={(value) =>
                    onClickDay(legacyDateFromPlainDate(value))
                  }
                  onCreate={(anchorEl) => setSelectedDay({ anchorEl, date })}
                />
              );
            })
          )
        }
      </Box>
      {selectedDay && !shiftModalOpen && (
        <EventCreateMenu
          anchorEl={selectedDay.anchorEl}
          disabled={creating}
          id={menuId}
          onClose={() => setSelectedDay(null)}
          onCreateShifts={() => setShiftModalOpen(true)}
          onCreateSingle={onCreateSingle}
          openTowardsLeft={selectedDay.date.dayOfWeek > 4}
        />
      )}
      {selectedDay && defaultStart && defaultEnd && shiftModalOpen && (
        <EventShiftModal
          key={selectedDay.date.toString()}
          close={() => {
            selectedDay.anchorEl.focus();
            setSelectedDay(null);
            setShiftModalOpen(false);
          }}
          dates={[
            // The shift dialog reads UTC fields as wall-clock time, rather than
            // converting an instant to the browser's time zone.
            new Date(`${defaultStart}Z`),
            new Date(`${defaultEnd}Z`),
          ]}
          open={true}
        />
      )}
    </>
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
