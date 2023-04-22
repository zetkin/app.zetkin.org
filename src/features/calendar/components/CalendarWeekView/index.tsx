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
  return (
    <Grid container xs={12/7} marginTop={2} padding={2} >
      <Grid item xs={4} sx={
        {
          color: theme.palette.statusColors.gray,
          fontWeight: "bold"
        }
      }>
        {date.format('ddd')}
      </Grid>
      <Grid item xs={4} sx={
          {
            textAlign: "center", 
          }
        }>
        <Box sx={
          {
            backgroundColor: focused ? theme.palette.statusColors.blue : "",
            color: focused ? "white" : "inherit", 
            textAlign: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }
        }> 
        {date.format('D')}
        </Box>
          
        </Grid>
      <Grid item xs={4} ></Grid>
    </Grid>
  );
};

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const TIME_COLUMN_WIDTH = '3em';
const DAY_COLUMN_MIN_WIDTH = '2em';

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid container xs={1} />
        <Grid container xs={11}>
          {_.range(7).map((weekday: number) => {
            const weekdayDate = dayjs(focusDate).day(weekday + 1);

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
