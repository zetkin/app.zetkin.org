import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { FormattedTime } from 'react-intl';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Event, SplitscreenOutlined } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import DayHeader from './DayHeader';
import EventCluster from '../EventCluster';
import EventDayLane from './EventDayLane';
import EventGhost from './EventGhost';
import EventShiftModal from '../EventShiftModal';
import HeaderWeekNumber from './HeaderWeekNumber';
import { isSameDate } from 'utils/dateUtils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import range from 'utils/range';
import { scrollToEarliestEvent } from './utils';
import { getDstChangeAtDate } from '../utils';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import { useNumericRouteParams } from 'core/hooks';
import useWeekCalendarEvents from 'features/calendar/hooks/useWeekCalendarEvents';

dayjs.extend(isoWeek);

const HOUR_HEIGHT = 80;
const HOUR_COLUMN_WIDTH = '60px';

export interface CalendarWeekViewProps {
  focusDate: Date;
  onClickDay: (date: Date) => void;
}
const CalendarWeekView = ({ focusDate, onClickDay }: CalendarWeekViewProps) => {
  const theme = useTheme();
  const [creating, setCreating] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<[Date, Date] | null>(null);
  const [ghostAnchorEl, setGhostAnchorEl] = useState<HTMLDivElement | null>(
    null
  );
  const { orgId, campId } = useNumericRouteParams();
  const createEvent = useCreateEvent(orgId);
  const focusWeekStartDay =
    dayjs(focusDate).isoWeekday() == 7
      ? dayjs(focusDate).add(-1, 'day')
      : dayjs(focusDate);

  const dayDates = range(7).map((weekday) => {
    return focusWeekStartDay.day(weekday + 1).toDate();
  });

  const dstChange = useMemo(
    () =>
      dayDates.map((d) => dayjs(d)).find((date) => getDstChangeAtDate(date)),
    [dayDates]
  );

  const eventsByDate = useWeekCalendarEvents({
    campaignId: campId,
    dates: dayDates,
    orgId,
  });

  let laneHeight = 0;
  const weekGridRef = useRef<HTMLDivElement>();
  // This should only run when focusDate changes
  useEffect(() => {
    scrollToEarliestEvent(
      weekGridRef.current,
      laneHeight,
      eventsByDate.map((a) => a.lanes)
    );
  }, [focusDate]);

  return (
    <>
      {/* Headers across the top */}
      <Box
        alignItems={'flex-start'}
        columnGap={1}
        display="grid"
        gridTemplateColumns={`${HOUR_COLUMN_WIDTH} repeat(7, 1fr)`}
        gridTemplateRows={'1fr'}
        marginBottom={dstChange === undefined ? 2 : 0}
      >
        {/* Empty */}
        <HeaderWeekNumber weekNr={dayjs(dayDates[0]).isoWeek()} />
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
        ref={weekGridRef}
        columnGap={1}
        display="grid"
        gridTemplateColumns={`${HOUR_COLUMN_WIDTH} repeat(7, 1fr)`}
        gridTemplateRows={'1fr'}
        height="100%"
        overflow="auto"
      >
        {/* Hours column */}
        <Box>
          {range(24).map((hour: number) => {
            const time = dayjs().set('hour', hour).set('minute', 0).toString();
            return (
              <Box
                key={`hour-${hour}`}
                display="flex"
                height={`${HOUR_HEIGHT}px`}
                justifyContent="flex-end"
              >
                <Typography color={theme.palette.grey[500]} variant="caption">
                  <FormattedTime hour="numeric" minute="numeric" value={time} />
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
              ref={(elm: HTMLDivElement) =>
                (laneHeight = elm?.clientHeight ?? 0)
              }
              flexGrow={1}
              height={`${HOUR_HEIGHT * 24}px`}
              sx={{
                backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}px)`,
                marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
                overflow: 'hidden', // Will prevent the ghostElement to expand the size of the calender, showing vertical scrollbar and whitespace underneath calender #issue-#1614
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
                      endTime[0] >= 24 ? 23 : endTime[0],
                      endTime[0] >= 24 ? 59 : endTime[1]
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
                        key={`lane-${cluster.events[0].id}`}
                        sx={{
                          '&:hover': {
                            zIndex: 100,
                          },
                          left: `${laneOffset * 100}%`,
                          overflow: 'hidden',
                          // Padding (and offset `top`) make room for the TopBadge
                          // if there is one, without it overflowing (and clipping)
                          paddingTop: '20px',
                          position: 'absolute',
                          top: `calc(${startOffs * 100}% - 20px)`,
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
                          vertical: 'bottom',
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
                            await createEvent({
                              activity_id: null,
                              campaign_id: campId,
                              end_time: pendingEvent[1].toISOString(),
                              location_id: null,
                              start_time: pendingEvent[0].toISOString(),
                              title: null,
                            });
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
                        <MenuItem
                          onClick={() => {
                            setCreating(true);
                            setGhostAnchorEl(null);
                            setShiftModalOpen(true);
                          }}
                        >
                          <ListItemIcon>
                            <SplitscreenOutlined />
                          </ListItemIcon>
                          <ListItemText>
                            <Msg id={messageIds.createMenu.shiftEvent} />
                          </ListItemText>
                        </MenuItem>
                      </Menu>
                    )}
                    <EventShiftModal
                      close={() => {
                        setShiftModalOpen(false);
                        setPendingEvent(null);
                        setCreating(false);
                      }}
                      dates={pendingEvent}
                      open={shiftModalOpen}
                    />
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
