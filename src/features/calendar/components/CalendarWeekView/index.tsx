import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { FormattedTime } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Typography } from '@mui/material';

import DayHeader from './DayHeader';
import { eventCreated } from 'features/events/store';
import EventDayLane from './EventDayLane';
import range from 'utils/range';
import theme from 'theme';
import { useStore } from 'react-redux';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventPostBody } from 'features/events/repo/EventsRepo';
import { useEnv, useNumericRouteParams } from 'core/hooks';

dayjs.extend(isoWeek);

const HOUR_HEIGHT = 5;

export interface CalendarWeekViewProps {
  focusDate: Date;
}

const CalendarWeekView = ({ focusDate }: CalendarWeekViewProps) => {
  const createAndNavigate = useCreateEvent();
  const focusWeekStartDay =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : dayjs(focusDate);

  const dayDates = range(7).map((weekday) => {
    return focusWeekStartDay.day(weekday + 1).toDate();
  });

  return (
    <Box
      columnGap={1}
      display="grid"
      gridTemplateColumns={'auto repeat(7, 1fr)'}
      gridTemplateRows={'auto 1fr'}
      rowGap={1}
    >
      {/* Week Number */}
      <Box alignItems="center" display="flex">
        <Typography color={theme.palette.grey[500]} variant="caption">
          {focusWeekStartDay.isoWeek()}
        </Typography>
      </Box>
      {/* Day headers across the top */}
      {dayDates.map((weekdayDate) => {
        return (
          <DayHeader
            key={weekdayDate.toISOString()}
            date={weekdayDate}
            focused={new Date().toDateString() == weekdayDate.toDateString()}
          />
        );
      })}
      {/* Hours column */}
      <Box>
        {range(24).map((hour: number) => {
          const time = dayjs().set('hour', hour).set('minute', 0);
          return (
            <Box key={hour} display="flex" height={`${HOUR_HEIGHT}em`}>
              <Typography color={theme.palette.grey[500]} variant="caption">
                <FormattedTime
                  hour="numeric"
                  hour12={false}
                  minute="numeric"
                  value={time.toDate()}
                />
              </Typography>
            </Box>
          );
        })}
      </Box>
      {/* Day columns */}
      {dayDates.map((date) => {
        return (
          <Box
            key={date.toISOString()}
            flexGrow={1}
            height={`${HOUR_HEIGHT * 24}em`}
            sx={{
              backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}em)`,
              marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
            }}
          >
            <EventDayLane
              onCreate={(startTime, endTime) => {
                const startDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  startTime[0],
                  startTime[1]
                );
                const endDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  endTime[0],
                  endTime[1]
                );

                createAndNavigate(startDate, endDate);
              }}
            >
              {/* TODO: Put events here */}
            </EventDayLane>
          </Box>
        );
      })}
    </Box>
  );
};

export default CalendarWeekView;

function useCreateEvent() {
  const env = useEnv();
  const store = useStore();
  const { campId, orgId } = useNumericRouteParams();

  async function createAndNavigate(startDate: Date, endDate: Date) {
    const event = await env.apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      campId
        ? `/api/orgs/${orgId}/campaigns/${campId}/actions`
        : `/api/orgs/${orgId}/actions`,
      {
        // TODO: Use null when possible for activity, campaign and location
        activity_id: 1,
        end_time: endDate.toISOString(),
        location_id: 1,
        start_time: startDate.toISOString(),
      }
    );

    store.dispatch(eventCreated(event));

    const campaignId = event.campaign?.id ?? 'standalone';
    const url = `/organize/${orgId}/projects/${campaignId}/events/${event.id}`;
    env.router.push(url);
  }

  return createAndNavigate;
}
