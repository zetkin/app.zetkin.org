import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TimeScale } from './types';

export interface CalendarStoreSlice {
  focusDate: string;
  maxMonthEventsPerDay: number;
  weekViewDates: string[];
  timeScale: string;
  monthViewSpan: {
    endDate: string | undefined;
    startDate: string | undefined;
  };
}

const initialState: CalendarStoreSlice = {
  focusDate: new Date().toISOString(),
  maxMonthEventsPerDay: 0,
  monthViewSpan: {
    endDate: undefined,
    startDate: undefined,
  },
  timeScale: '',
  weekViewDates: [],
};

const calendarSlice = createSlice({
  initialState,
  name: 'calendar',
  reducers: {
    setFocusDate(state, action: PayloadAction<string>) {
      state.focusDate = action.payload;
    },
    setMaxMonthEventsPerDay(state, action: PayloadAction<number>) {
      state.maxMonthEventsPerDay = action.payload;
    },
    setMonthViewSpan(
      state,
      action: PayloadAction<{ endDate: string; startDate: string }>
    ) {
      const { startDate, endDate } = action.payload;
      state.monthViewSpan = {
        endDate: endDate,
        startDate: startDate,
      };
    },
    setTimeScale(state, action: PayloadAction<TimeScale>) {
      state.timeScale = action.payload;
    },
    setWeekViewDates(state, action: PayloadAction<string[]>) {
      state.weekViewDates = action.payload;
    },
  },
});

export default calendarSlice;
export const {
  setFocusDate,
  setMaxMonthEventsPerDay,
  setMonthViewSpan,
  setTimeScale,
  setWeekViewDates,
} = calendarSlice.actions;
