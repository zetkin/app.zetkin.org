import _ from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import { Grid, TextField } from '@mui/material';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <>
      <Grid item>{date.format('ddd')}</Grid>
      <Grid item>{date.format('D')}</Grid>
    </>
  );
};

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  return (
    <Grid container>
      <Grid container spacing={2}>
        {_.range(7).map((weekday: number) => {
          const weekdayDate = dayjs(focusDate).day(weekday + 1);

          return (
            <DayHeader
              key={weekday}
              date={weekdayDate}
              focused={focusDate == weekdayDate.toDate()}
            />
          );
        })}
      </Grid>
      <Grid container spacing={2}></Grid>
    </Grid>
  );
};

export default CalendarWeekView;
