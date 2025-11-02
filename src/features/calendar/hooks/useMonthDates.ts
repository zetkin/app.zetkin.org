import dayjs from 'dayjs';

import { useFocusDate } from 'utils/hooks/useFocusDate';
import { getDaysBeforeFirstDay } from '../components/CalendarMonthView/utils';

export const useMonthDates = () => {
  const focusDate = useFocusDate();

  const firstDayOfMonth: Date = new Date(
    Date.UTC(
      focusDate.focusDate.getFullYear(),
      focusDate.focusDate.getMonth(),
      1
    )
  );
  const firstDayOfCalendar: Date = dayjs(firstDayOfMonth)
    .subtract(getDaysBeforeFirstDay(firstDayOfMonth), 'day')
    .toDate();
  const lastDayOfCalendar = new Date(firstDayOfCalendar);
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + 6 * 7);

  return {
    firstDayOfCalendar,
    lastDayOfCalendar,
  };
};
