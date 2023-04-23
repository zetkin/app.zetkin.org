import _ from 'lodash';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import theme from 'theme';

export interface DayHeaderProps {
  date: Dayjs;
  focused: boolean;
}

const DayHeader = ({ date, focused }: DayHeaderProps) => {
  return (
    <Grid container marginTop={2} padding={2} xs={12 / 7}>
      <Grid
        item
        sx={{
          color: theme.palette.statusColors.gray,
          fontWeight: 'bold',
        }}
        xs={4}
      >
        {date.format('ddd')}
      </Grid>
      <Grid
        item
        sx={{
          textAlign: 'center',
        }}
        xs={4}
      >
        <Box
          sx={{
            backgroundColor: focused ? theme.palette.statusColors.blue : '',
            color: focused ? 'white' : 'inherit',
            textAlign: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
          }}
        >
          {date.format('D')}
        </Box>
      </Grid>
      <Grid item xs={4}></Grid>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid container>
        <Grid container spacing={1}>
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
        <Box
          sx={{
            height: '60vh',
            overflowY: 'auto',
          }}
        >
          <Grid container sx={{ marginTop: '1em' }}>
            {_.range(24).map((hour: number) => {
              return (
                <Grid key={hour} container>
                  <Grid item width={TIME_COLUMN_WIDTH} xs={1}>
                    {hour}.00
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    sx={{ borderWidth: '5px' }}
                    xs={11}
                  >
                    {_.range(7).map((weekday: number) => {
                      return (
                        <Grid
                          key={weekday}
                          item
                          sx={{
                            height: '8em',
                          }}
                          xs={12 / 7}
                        >
                          <Box
                            sx={{
                              backgroundColor: theme.palette.statusColors.gray,
                              borderBottomColor: theme.palette.divider,
                              borderBottomStyle: hour !== 23 ? 'solid' : null,
                              borderBottomWidth: '2px',
                              height: '100%',
                              width: '100%',
                            }}
                          ></Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default CalendarWeekView;
