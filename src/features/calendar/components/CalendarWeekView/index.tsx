import _ from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import { Grid, TextField } from '@mui/material';
import theme from 'theme';
import { Box, fontWeight } from '@mui/system';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  const week = dayjs(date).isoWeek().toString()
  const isFirstDayOfWeek = dayjs(date).isoWeekday() == 1

  return (
    <Grid container xs={12 / 7} marginTop={2} >
      <Grid item xs={5}>
        <Box sx={
          {
            color: theme.palette.statusColors.gray,
            fontSize: "12px",
            display: "flex",
            height: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
          }
        }>
          <b>{date.format('ddd')}</b>&nbsp;{ isFirstDayOfWeek ? " " +"w" + week : "" } 
        </Box>
      </Grid>
      <Grid item xs={2} sx={
        {
          textAlign: "center",
        }
      }>
        <Box sx={
          {
            backgroundColor: focused ? theme.palette.statusColors.blue : "",
            color: focused ? "white" : "inherit",
            textAlign: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            fontSize: "20px",
          }
        }>
          {date.format('D')}
        </Box>
      </Grid>
      <Grid item xs={5} ></Grid>
    </Grid>
  );
};

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const TIME_COLUMN_WIDTH = '3em';
const DAY_COLUMN_MIN_WIDTH = '2em';

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  const isoWeek = require('dayjs/plugin/isoWeek')
  dayjs.extend(isoWeek)
  const correctWeek = dayjs(focusDate).isoWeekday() == 7 ? dayjs(focusDate).add(-1, 'day') : focusDate

  return (
  
    <Grid container>
      <Grid container spacing={2}>
        <Grid container xs={1} />
        <Grid container xs={11}>
          {_.range(7).map((weekday: number) => {
            const weekdayDate = dayjs(correctWeek).day(weekday + 1);

            return (
              <DayHeader
                key={weekday}
                date={weekdayDate}
                focused={
                  new Date().toDateString() ==
                  weekdayDate.toDate().toDateString()
                }
              />
            );
          })}
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: '1em' }}>
        {_.range(24).map((hour: number) => {
          return (
            <Grid key={hour} container>
              <Grid item width={TIME_COLUMN_WIDTH} xs={1}>
                {hour}:00
              </Grid>
              <Grid container spacing={2} sx={{ borderWidth: '5px' }} xs={11}>
                {_.range(7).map((weekday: number) => {
                  return (
                    <Grid
                      key={weekday}
                      item
                      sx={{
                        backgroundColor: 'gray',
                        height: '10em',
                      }}
                      xs={12 / 7}
                    >
                      test
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};


export default CalendarWeekView;
