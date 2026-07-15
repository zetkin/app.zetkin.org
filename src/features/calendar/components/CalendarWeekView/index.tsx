import { Box, lighten } from '@mui/system';
import { Event, SplitscreenOutlined } from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import DayHeader from './DayHeader';
import EventCluster from '../EventCluster';
import EventDayLane from './EventDayLane';
import EventGhost from './EventGhost';
import EventShiftModal from '../EventShiftModal';
import HeaderWeekNumber from './HeaderWeekNumber';
import { legacyDateFromPlainDate } from 'utils/dateUtils';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg } from 'core/i18n';
import range from 'utils/range';
import { scrollToEarliestEvent } from './utils';
import { getDstChangeAtDate } from '../utils';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import { useNumericRouteParams } from 'core/hooks';
import useWeekCalendarEvents from 'features/calendar/hooks/useWeekCalendarEvents';

const HOUR_HEIGHT = 80;
const HOUR_COLUMN_WIDTH = '60px';

const CurrentTimeCircleMarker = ({
  currentTime,
}: {
  currentTime: Temporal.PlainTime;
}) => {
  const topOffset =
    currentTime.since({ hour: 0, minute: 0, second: 0 }).total('hours') *
    HOUR_HEIGHT;
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.main,
        border: '2px solid white',
        borderRadius: '100%',
        height: '14px',
        position: 'absolute',
        top: `${topOffset}px`,
        translate: '-30% -50%',
        width: '14px',
        zIndex: 1000,
      })}
    />
  );
};

const CurrentTimeLineMarker = ({
  currentTime,
}: {
  currentTime: Temporal.PlainTime;
}) => {
  const topOffset =
    currentTime.since({ hour: 0, minute: 0, second: 0 }).total('hours') *
    HOUR_HEIGHT;
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.primary.main, 0.4),
        height: '2px',
        mixBlendMode: 'multiply',
        opacity: 0.5,
        position: 'absolute',
        top: `${topOffset}px`,
        translate: '0 -50%',
        width: 'calc((100% + 7px) * 7 - 1px)',
        zIndex: 1000,
      })}
    />
  );
};

export interface CalendarWeekViewProps {
  focusDate: Temporal.PlainDate;
  onClickDay: (date: Date) => void;
}
const CalendarWeekView = ({ focusDate, onClickDay }: CalendarWeekViewProps) => {
  const [creating, setCreating] = useState(false);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<
    [Temporal.PlainDateTime, Temporal.PlainDateTime] | null
  >(null);
  const [ghostAnchorEl, setGhostAnchorEl] = useState<HTMLDivElement | null>(
    null
  );
  const { orgId, projectId } = useNumericRouteParams();
  const createEvent = useCreateEvent(orgId);
  const focusWeekStartDay = focusDate.subtract({
    days: focusDate.dayOfWeek - 1,
  });

  const dayDates = range(7).map((weekday) => {
    return focusWeekStartDay.add({ days: weekday });
  });

  const dstChange = useMemo(
    () => dayDates.find(getDstChangeAtDate),
    [dayDates]
  );

  const eventsByDate = useWeekCalendarEvents({
    dates: dayDates.map(legacyDateFromPlainDate),
    orgId,
    projectId,
  });

  const [currentTime, setCurrentTime] = useState<Temporal.PlainDateTime>(
    Temporal.Now.plainDateTimeISO()
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Temporal.Now.plainDateTimeISO());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  let laneHeight = 0;
  const weekGridRef = useRef<HTMLDivElement>();
  // This should only run when focusDate changes
  useEffect(() => {
    scrollToEarliestEvent(
      weekGridRef.current,
      laneHeight,
      eventsByDate.map((a) => a.lanes)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        position="relative"
      >
        {/* Empty */}
        <HeaderWeekNumber weekNr={dayDates[0].weekOfYear!} />
        {dayDates.map((weekdayDate: Temporal.PlainDate, weekday: number) => {
          return (
            <Box key={`weekday-${weekday}`} position="relative">
              <DayHeader
                date={weekdayDate}
                focused={Temporal.Now.plainDateISO().equals(weekdayDate)}
                onClick={() => onClickDay(legacyDateFromPlainDate(weekdayDate))}
              />
              <Box
                sx={{
                  bottom: 0,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  translate: '0 calc(100% + 4px)',
                  zIndex: 10,
                }}
              >
                {eventsByDate[weekday].multidayEvents.flatMap((lane) => {
                  return lane.map((cluster) => {
                    return (
                      <Box key={`fulldaylane-${cluster.events[0].id}`}>
                        <EventCluster cluster={cluster} height={30} />
                      </Box>
                    );
                  });
                })}
              </Box>
            </Box>
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
            const time = Temporal.PlainTime.from({ hour });
            return (
              <Box
                key={`hour-${hour}`}
                display="flex"
                height={`${HOUR_HEIGHT}px`}
                justifyContent="flex-end"
              >
                <Typography color="textDisabled" variant="caption">
                  {time.toLocaleString(undefined, {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Typography>
              </Box>
            );
          })}
        </Box>
        {/* Day columns */}
        {dayDates.map((date: Temporal.PlainDate, index: number) => {
          const pendingTop = pendingEvent
            ? (pendingEvent[0].hour * 60 + pendingEvent[0].minute) / (24 * 60)
            : 0;
          const pendingHeight = pendingEvent
            ? (pendingEvent[1].hour * 60 + pendingEvent[1].minute) / (24 * 60) -
              pendingTop
            : 0;

          const lanes = eventsByDate[index].lanes;

          return (
            <Box
              key={date.toString()}
              ref={(elm: HTMLDivElement | null) => {
                laneHeight = elm?.clientHeight ?? 0;
              }}
              flexGrow={1}
              height={`${HOUR_HEIGHT * 24}px`}
              sx={{
                marginTop: '0.6em', // Aligns the hour marker on each day to the hour on the hour column
                position: 'relative',
              }}
            >
              {index === 0 && (
                <CurrentTimeLineMarker
                  currentTime={currentTime.toPlainTime()}
                />
              )}
              {currentTime.toPlainDate().equals(date) && (
                <CurrentTimeCircleMarker
                  currentTime={currentTime.toPlainTime()}
                />
              )}
              <Box
                ref={(elm: HTMLDivElement) => {
                  laneHeight = elm?.clientHeight ?? 0;
                }}
                flexGrow={1}
                height={`${HOUR_HEIGHT * 24}px`}
                sx={(theme) => ({
                  backgroundImage: `repeating-linear-gradient(180deg, ${theme.palette.grey[400]}, ${theme.palette.grey[400]} 1px, ${theme.palette.grey[200]} 1px, ${theme.palette.grey[200]} ${HOUR_HEIGHT}px)`,
                  overflow: 'hidden', // Will prevent the ghostElement to expand the size of the calender, showing vertical scrollbar and whitespace underneath calender #issue-#1614
                })}
              >
                <EventDayLane
                  onCreate={(startTime, endTime) => {
                    const startDate = date.toPlainDateTime({
                      hour: startTime[0],
                      minute: startTime[1],
                    });
                    const endDate = date.toPlainDateTime({
                      hour: endTime[0] >= 24 ? 23 : endTime[0],
                      minute: endTime[0] >= 24 ? 59 : endTime[1],
                    });

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
                          <EventCluster
                            cluster={cluster}
                            height={pixelHeight}
                          />
                        </Box>
                      );
                    });
                  })}
                  {pendingEvent &&
                    date.equals(pendingEvent[0].toPlainDate()) && (
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
                                  campaign_id: projectId,
                                  end_time: pendingEvent[1].toString(),
                                  location_id: null,
                                  start_time: pendingEvent[0].toString(),
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
                          dates={[
                            legacyDateFromPlainDateTime(pendingEvent[0]),
                            legacyDateFromPlainDateTime(pendingEvent[1]),
                          ]}
                          open={shiftModalOpen}
                        />
                      </>
                    )}
                  {/* TODO: Put events here */}
                </EventDayLane>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

const legacyDateFromPlainDateTime = (date: Temporal.PlainDateTime): Date =>
  new Date(date.toZonedDateTime(Temporal.Now.timeZoneId()).epochMilliseconds);

export default CalendarWeekView;
