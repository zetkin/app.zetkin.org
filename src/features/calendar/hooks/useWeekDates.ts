import dayjs from 'dayjs';
import { range } from 'lodash';

import { useFocusDate } from 'utils/hooks/useFocusDate';

export const useWeekDates = () => {
  const focusDate = useFocusDate();

  const focusWeekStartDay =
    dayjs(focusDate.focusDate).isoWeekday() == 7
      ? dayjs(focusDate.focusDate).add(-1, 'day')
      : dayjs(focusDate.focusDate);

  const weekDates = range(7).map((weekday) =>
    focusWeekStartDay.day(weekday + 1).toDate()
  );
  return {
    weekDates,
  };
};
