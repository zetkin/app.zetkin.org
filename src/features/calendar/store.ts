import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TimeScale } from './types';

export interface CalendarStoreSlice {
  focusDate: string;
  maxMonthEventsPerDay: number;
  timeScale: string;
}

const initialState: CalendarStoreSlice = {
  focusDate: new Date().toISOString(),
  maxMonthEventsPerDay: 0,
  timeScale: '',
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
    setTimeScale(state, action: PayloadAction<TimeScale>) {
      state.timeScale = action.payload;
    },
  },
});

export default calendarSlice;
export const { setFocusDate, setMaxMonthEventsPerDay, setTimeScale } =
  calendarSlice.actions;
