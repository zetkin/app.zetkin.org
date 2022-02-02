export enum CALENDAR_RANGES {
  MONTH = 'month',
  WEEK = 'week',
}

interface FirstAndLastDayInView {
  firstDayInView: Date;
  lastDayInView: Date;
}

/**
 * Get first and laste date in visible range for week or month calendar views
 */
export const getViewRange = (
  focusDate: Date,
  range: CALENDAR_RANGES
): FirstAndLastDayInView => {
  if (range === CALENDAR_RANGES.MONTH) {
    const year = focusDate.getFullYear();
    const month = focusDate.getMonth();
    const firstMonthDay = new Date(year, month, 1);
    const firstDayInView = new Date(
      new Date(firstMonthDay).setDate(
        firstMonthDay.getDate() - (firstMonthDay.getDay() || 7) + 1
      )
    );
    const lastMonthDay = new Date(year, month + 1, 1);
    const lastDayInView = new Date(
      lastMonthDay.getFullYear(),
      lastMonthDay.getMonth(),
      ((8 - lastMonthDay.getDay()) % 7) + 1
    );

    return { firstDayInView, lastDayInView };
  } else {
    // ranges == CALENDAR_RANGES.WEEK
    const dayIndexFromMonday = (focusDate.getDay() + 6) % 7;
    const firstDayInView = new Date(
      focusDate.getFullYear(),
      focusDate.getMonth(),
      focusDate.getDate() - dayIndexFromMonday
    );
    const lastDayInView = new Date(
      focusDate.getFullYear(),
      focusDate.getMonth(),
      focusDate.getDate() + (7 - dayIndexFromMonday)
    );

    return { firstDayInView, lastDayInView };
  }
};
