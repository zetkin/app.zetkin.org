import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { FormattedTime } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useState } from 'react';
import { useStore } from 'react-redux';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import DayHeader from './DayHeader';
import { Event } from '@mui/icons-material';
import EventCluster from '../EventCluster';
import { eventCreated } from 'features/events/store';
import EventDayLane from './EventDayLane';
import EventGhost from './EventGhost';
import { isSameDate } from 'utils/dateUtils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import range from 'utils/range';
import theme from 'theme';
import useWeekCalendarEvents from 'features/calendar/hooks/useWeekCalendarEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZetkinEventPostBody } from 'features/events/repo/EventsRepo';
import { useEnv, useNumericRouteParams } from 'core/hooks';

dayjs.extend(isoWeek);

const HOUR_HEIGHT = 80;
const HOUR_COLUMN_WIDTH = '50px';

export interface CalendarWeekViewProps {
  focusDate: Date;
  onClickDay: (date: Date) => void;
}

const CalendarWeekView = ({ focusDate, onClickDay }: CalendarWeekViewProps) => {
  const [creating, setCreating] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<[Date, Date] | null>(null);
  const [ghostAnchorEl, setGhostAnchorEl] = useState<HTMLDivElement | null>(
    null
  );
  const createAndNavigate = useCreateEvent();
  const focusWeekStartDay =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : dayjs(focusDate);

  const dayDates = range(7).map((weekday) => {
    return focusWeekStartDay.day(weekday + 1).toDate();
  });

  const { orgId, campId } = useNumericRouteParams();
  const eventsByDate = useWeekCalendarEvents({
    campaignId: campId,
    dates: dayDates,
    orgId,
  });

  return (
    <>
      {/* Headers across the top */}
      <Box
        columnGap={1}
        display="grid"
        gridTemplateColumns={`${HOUR_COLUMN_WIDTH} repeat(7, 1fr)`}
        gridTemplateRows={'1fr'}
      >
        {/* Empty */}
        <Box />
        {dayDates.map((weekdayDate: Date, weekday: number) => {
          return (
            <DayHeader
              key={`weekday-${weekday}`}
              date={weekdayDate}
              focused={new Date().toDateString() == weekdayDate.toDateString()}
              onClick={() => onClickDay(weekdayDate)}
            />
          );
        })}
      </Box>
      {/* Week grid */}
      <Box
        columnGap={1}
        display="grid"
        gridTemplateColumns={`${HOUR_COLUMN_WIDTH} repeat(7, 1fr)`}
        gridTemplateRows={'1fr'}
        height="100%"
        marginTop={2}
        overflow="scroll"
      >
        {/* Hours column */}
        <Box>
          {range(24).map((hour: number) => {
            const time = dayjs().set('hour', hour).set('minute', 0);
            return (
              <Box
                key={`hour-${hour}`}
                display="flex"
                height={`${HOUR_HEIGHT}px`}
                justifyContent="flex-end"
              >
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
        {dayDates.map((date: Date, index: number) => {
          const pendingTop = pendingEvent
            ? (pendingEvent[0].getUTCHours() * 60 +
                pendingEvent[0].getMinutes()) /
              (24 * 60)
            : 0;
          const pendingHeight = pendingEvent
            ? (pendingEvent[1].getUTCHours() * 60 +
                pendingEvent[1].getMinutes()) /
                (24 * 60) -
              pendingTop
            : 0;

          const lanes = eventsByDate[index].lanes;

          return (
            <Box
              key={date.toISOString()}
              flexGrow={1}
              height={`${HOUR_HEIGHT * 24}px`}
              sx={{
                backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}px)`,
                marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
              }}
            >
              <EventDayLane
                onCreate={(startTime, endTime) => {
                  const startDate = new Date(
                    Date.UTC(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      startTime[0],
                      startTime[1]
                    )
                  );

                  const endDate = new Date(
                    Date.UTC(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      endTime[0],
                      endTime[1]
                    )
                  );

                  setPendingEvent([startDate, endDate]);
                }}
                onDragStart={() => setPendingEvent(null)}
              >
                {lanes.flatMap((lane, laneIdx) => {
                  return lane.map((cluster) => {
                    const startTime = new Date(cluster.events[0].start_time);
                    const endTime = new Date(
                      cluster.events[cluster.events.length - 1].end_time
                    );
                    const startOffs =
                      (startTime.getUTCHours() +
                        startTime.getUTCMinutes() / 60) /
                      24;
                    const endOffs =
                      (endTime.getUTCHours() + endTime.getUTCMinutes() / 60) /
                      24;

                    const height = Math.max(endOffs - startOffs, 1 / 3 / 24);

                    const laneOffset = 0.15 * laneIdx;
                    const width =
                      1 - laneOffset - (lanes.length - laneIdx) * 0.05;

                    const pixelHeight = height * HOUR_HEIGHT * 24;

                    return (
                      <Box
                        key={`laneIdx-${laneIdx}`}
                        sx={{
                          '&:hover': {
                            zIndex: 100,
                          },
                          // TODO: This will be replaced with real event components (WIP)
                          left: `${laneOffset * 100}%`,
                          position: 'absolute',
                          top: `${startOffs * 100}%`,
                          width: `${width * 100}%`,
                        }}
                      >
                        <EventCluster cluster={cluster} height={pixelHeight} />
                      </Box>
                    );
                  });
                })}
                {pendingEvent && isSameDate(date, pendingEvent[0]) && (
                  <>
                    <EventGhost
                      ref={(div: HTMLDivElement) => setGhostAnchorEl(div)}
                      height={pendingHeight * 100 + '%'}
                      y={pendingTop * 100 + '%'}
                    />
                    {ghostAnchorEl && !creating && (
                      <Menu
                        anchorEl={ghostAnchorEl}
                        anchorOrigin={{
                          horizontal: index > 3 ? 'left' : 'right',
                          vertical: 'top',
                        }}
                        onClose={() => {
                          setPendingEvent(null);
                          setGhostAnchorEl(null);
                        }}
                        open={true}
                        transformOrigin={{
                          horizontal: index > 3 ? 'right' : 'left',
                          vertical: 'top',
                        }}
                      >
                        <MenuItem
                          onClick={async () => {
                            setCreating(true);
                            setGhostAnchorEl(null);
                            await createAndNavigate(
                              pendingEvent[0],
                              pendingEvent[1]
                            );
                            setPendingEvent(null);
                            setCreating(false);
                          }}
                        >
                          <ListItemIcon>
                            <Event />
                          </ListItemIcon>
                          <ListItemText>
                            <Msg id={messageIds.createMenu.singleEvent} />
                          </ListItemText>
                        </MenuItem>
                      </Menu>
                    )}
                  </>
                )}
                {/* TODO: Put events here */}
              </EventDayLane>
            </Box>
          );
        })}
      </Box>
    </>
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
        activity_id: null,
        end_time: endDate.toISOString(),
        location_id: null,
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
