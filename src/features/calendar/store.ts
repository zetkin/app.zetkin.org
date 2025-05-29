import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TimeScale } from './types';

export interface CalendarStoreSlice {
  focusDate: Date;
  timeScale: TimeScale;
}

const initialState: CalendarStoreSlice = {
  focusDate: new Date(),
  timeScale: 'day',
};

const calendarSlice = createSlice({
  initialState,
  name: 'calendar',
  reducers: {
    setFocusDate(state, action: PayloadAction<Date>) {
      state.focusDate = action.payload;
    },
    setTimeScale(state, action: PayloadAction<TimeScale>) {
      state.timeScale = action.payload;
    },
  },
});

export default calendarSlice;
export const { setFocusDate, setTimeScale } = calendarSlice.actions;
