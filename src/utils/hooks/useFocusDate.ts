import { useMemo } from 'react';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from 'core/hooks';
import { RootState } from 'core/store';
import { setFocusDate } from 'features/calendar/store';

type focusDateState = {
  focusDate: Date;
  setFocusDate: (date: Date) => void;
};

export const useFocusDate = (): focusDateState => {
  const dispatch = useAppDispatch();
  const calendarStore = useAppSelector((state: RootState) => state.calendar);
  const focusDate = useMemo(
    () => dayjs(calendarStore.focusDate).toDate(),
    [calendarStore.focusDate]
  );
  return {
    focusDate,
    setFocusDate(date: Date) {
      dispatch(setFocusDate(date.toISOString()));
    },
  };
};
